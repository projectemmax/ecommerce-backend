/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';

export type CartValidationResponse = {
  valid: boolean;
  items: {
    productId: string;
    name: string;
    requestedQty: number;
    availableStock: number;
    valid: boolean;
    adjustedQty?: number;
    message?: string;
  }[];
};

@Injectable()
export class CartService {
  private readonly CART_TTL = 60 * 60 * 24; // 24 hours

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  // ================================
  // REDIS HELPERS
  // ================================

  private cartKey(userId: string) {
    return `cart:${userId}`;
  }

  private async cacheCart(userId: string, cart: any) {
    const redis = this.redisService.getClient();
    await redis.set(
      this.cartKey(userId),
      JSON.stringify(cart),
      'EX',
      this.CART_TTL,
    );
  }

  private async clearCache(userId: string) {
    const redis = this.redisService.getClient();
    await redis.del(this.cartKey(userId));
  }

  // ================================
  // UTILITIES
  // ================================

  private ensureDraft(status: OrderStatus) {
    if (status !== OrderStatus.DRAFT) {
      throw new BadRequestException('Cart can no longer be modified');
    }
  }

  private calculateTotal(items: { subtotal: any }[]) {
    return items.reduce((sum, i) => sum + Number(i.subtotal), 0);
  }

  // ================================
  // GET CART (CACHE FIRST)
  // ================================

  async getDraftCart(userId: string) {
    const redis = this.redisService.getClient();
    const cache = await redis.get(this.cartKey(userId));

    if (cache) {
      return JSON.parse(cache);
    }

    const cart = await this.prisma.order.findFirst({
      where: {
        userId,
        status: OrderStatus.DRAFT,
      },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (cart) {
      await this.cacheCart(userId, cart);
    }

    return cart;
  }

  // ================================
  // CREATE OR GET CART
  // ================================

  private generateOrderNumber(prefix = 'ORD') {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private async getOrCreateCart(tx: any, userId: string) {
    let cart = await tx.order.findFirst({
      where: {
        userId,
        status: OrderStatus.DRAFT,
      },
      include: {
        items: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!cart) {
      cart = await tx.order.create({
        data: {
          userId,
          orderNumber: this.generateOrderNumber('CART'),
          status: OrderStatus.DRAFT,
          paymentStatus: PaymentStatus.NONE,
          totalAmount: 0,
        },
        include: {
          items: { orderBy: { createdAt: 'asc' } },
        },
      });
    }

    return cart;
  }

  // ================================
  // ADD ITEM
  // ================================

  async addItem(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const cart = await this.getOrCreateCart(tx, userId);
      this.ensureDraft(cart.status);

      const product = await tx.product.findUnique({
        where: { id: productId },
        include:{
            images: {
                orderBy:{ order: 'asc' },
                take: 1,
            },
        }
      });

      if (!product) throw new NotFoundException('Product not found');

      const existingItem = await tx.orderItem.findUnique({
        where: {
          orderId_productId: {
            orderId: cart.id,
            productId,
          },
        },
      });

      const newQty = existingItem
        ? existingItem.quantity + quantity
        : quantity;

      // 🔥 STOCK GUARD (backend-level safety)
      if (newQty > product.stock) {
        throw new BadRequestException(
          `Only ${product.stock} items available`,
        );
      }

      if (existingItem) {
        await tx.orderItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: newQty,
            subtotal: newQty * Number(existingItem.priceSnapshot),
          },
        });
      } else {
        await tx.orderItem.create({
          data: {
            orderId: cart.id,
            productId,
            productName: product.name,
            productImage: product.images?.[0]?.url ?? product.imageUrl ?? null,
            priceSnapshot: product.price,
            quantity,
            subtotal: quantity * Number(product.price),
          },
        });
      }

      const items = await tx.orderItem.findMany({
        where: { orderId: cart.id },
      });

      return tx.order.update({
        where: { id: cart.id },
        data: {
          totalAmount: this.calculateTotal(items),
        },
        include: {
          items: { orderBy: { createdAt: 'asc' } },
        },
      });
    });

    await this.cacheCart(userId, order);
    return order;
  }

  // ================================
  // UPDATE QUANTITY
  // ================================

  async updateQuantity(
    userId: string,
    orderItemId: string,
    quantity: number,
  ) {
    if (quantity < 0) {
      throw new BadRequestException('Invalid quantity');
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const cart = await tx.order.findFirst({
        where: { userId, status: OrderStatus.DRAFT },
      });

      if (!cart) throw new NotFoundException('Cart not found');

      const item = await tx.orderItem.findUnique({
        where: { id: orderItemId },
      });

      if (!item) throw new NotFoundException('Item not found');

      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      const stock = product?.stock ?? 0;

      if (quantity > stock) {
        throw new BadRequestException(`Only ${stock} items available`);
      }

      if (quantity === 0) {
        await tx.orderItem.delete({ where: { id: orderItemId } });
      } else {
        await tx.orderItem.update({
          where: { id: orderItemId },
          data: {
            quantity,
            subtotal: quantity * Number(item.priceSnapshot),
          },
        });
      }

      const items = await tx.orderItem.findMany({
        where: { orderId: cart.id },
      });

      return tx.order.update({
        where: { id: cart.id },
        data: {
          totalAmount: this.calculateTotal(items),
        },
        include: {
          items: { orderBy: { createdAt: 'asc' } },
        },
      });
    });

    await this.cacheCart(userId, order);
    return order;
  }

  // ================================
  // VALIDATE CART (SHOPEE-STYLE)
  // ================================

  async validateCart(userId: string): Promise<CartValidationResponse> {
    const cart = await this.prisma.order.findFirst({
      where: {
        userId,
        status: OrderStatus.DRAFT,
      },
      include: {
        items: true,
      },
    });

    if (!cart) return { valid: true, items: [] };

    const validatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        const stock = product?.stock ?? 0;

        if (stock === 0) {
          return {
            productId: item.productId,
            name: item.productName,
            requestedQty: item.quantity,
            availableStock: 0,
            valid: false,
            message: 'Out of stock',
          };
        }

        if (item.quantity > stock) {
          return {
            productId: item.productId,
            name: item.productName,
            requestedQty: item.quantity,
            availableStock: stock,
            valid: false,
            adjustedQty: stock,
            message: `Only ${stock} left`,
          };
        }

        return {
          productId: item.productId,
          name: item.productName,
          requestedQty: item.quantity,
          availableStock: stock,
          valid: true,
        };
      }),
    );

    return {
      valid: validatedItems.every((i) => i.valid),
      items: validatedItems,
    };
  }

  // ================================
  // REMOVE ITEM
  // ================================

  async removeItem(userId: string, productId: string) {
    const order = await this.prisma.$transaction(async (tx) => {
      const cart = await tx.order.findFirst({
        where: { userId, status: OrderStatus.DRAFT },
        include: { items: true },
      });

      if (!cart) throw new NotFoundException('Cart not found');

      const item = cart.items.find((i) => i.productId === productId);
      if (!item) throw new NotFoundException('Item not found');

      await tx.orderItem.delete({ where: { id: item.id } });

      const items = await tx.orderItem.findMany({
        where: { orderId: cart.id },
      });

      return tx.order.update({
        where: { id: cart.id },
        data: {
          totalAmount: this.calculateTotal(items),
        },
        include: {
          items: { orderBy: { createdAt: 'asc' } },
        },
      });
    });

    await this.cacheCart(userId, order);
    return order;
  }

  // ================================
  // CLEAR CART
  // ================================

  async clearCart(userId: string) {
    await this.prisma.order.deleteMany({
      where: {
        userId,
        status: OrderStatus.DRAFT,
      },
    });

    await this.clearCache(userId);

    return { message: 'Cart cleared successfully' };
  }
}