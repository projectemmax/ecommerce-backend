import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminCartService {
    constructor(private prisma: PrismaService) {}

    // All active carts (DRAFT)
    async getAllDraftCarts() {
        return this.prisma.order.findMany({
        where: { status: OrderStatus.DRAFT },
        include: {
            user: {
            select: {
                email: true,
                role: true,
            },
            },
            items: true,
        },
        orderBy: { createdAt: 'desc' },
        });
    }

    // Cart by orderId
    async getCartById(orderId: string) {
        const cart = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: {
            select: { email: true },
            },
            items: true,
        },
        });

        if (!cart) {
        throw new NotFoundException('Cart not found');
        }

        return cart;
    }

    // Active cart by userId
    async getCartByUser(userId: string) {
        const cart = await this.prisma.order.findFirst({
        where: {
            userId,
            status: OrderStatus.DRAFT,
        },
        include: { items: true },
        });

        if (!cart) {
        throw new NotFoundException('No active cart for this user');
        }

        return cart;
    }

    // Force clear cart
    async clearCart(orderId: string) {
        const cart = await this.getCartById(orderId);

        await this.prisma.orderItem.deleteMany({
        where: { orderId: cart.id },
        });

        return this.prisma.order.update({
        where: { id: cart.id },
        data: { totalAmount: 0 },
        include: { items: true },
        });
    }
}