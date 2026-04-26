/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AccountDashboardService {

    constructor(private prisma: PrismaService) {}

    async getDashboard(userId: string) {

        const [
            totalOrders,
            toShipOrders,
            shippedOrders,
            deliveredOrders,
            recentOrders,
            defaultAddress
        ] = await Promise.all([

            this.prisma.order.count({
                where: { userId }
            }),

            this.prisma.order.count({
                where: {
                    userId,
                    status: OrderStatus.PROCESSING
                }
            }),

            this.prisma.order.count({
                where: {
                    userId,
                    status: OrderStatus.SHIPPED
                }
            }),

            this.prisma.order.count({
                where: {
                    userId,
                    status: OrderStatus.DELIVERED
                }
            }),

            this.prisma.order.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    createdAt: true,
                    items: {
                        take: 1,
                        select: {
                        productName: true,
                        productImage: true
                        }
                    }
                }
            }),

            this.prisma.customerAddress.findFirst({
                where: {
                    customer: {
                        userId
                    },
                    isDefault: true
                }
            })
        ]);

        return {
            orderStats: {
                total: totalOrders,
                toShip: toShipOrders,
                shipped: shippedOrders,
                delivered: deliveredOrders
            },
            recentOrders,
            defaultAddress
        };
    }
}