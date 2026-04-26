/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminCustomersService {
    constructor(private readonly prisma: PrismaService) {}

    async getCustomers() {
        return this.prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            customer: {
            select: {
                firstName: true,
                lastName: true,
                mobileNo: true,
                address: true,
                city: true,
                province: true,
            },
            },
        },
        orderBy: { createdAt: 'desc' },
        });
    }

    async activateCustomer(id: string) {
        return this.prisma.user.update({
            where: { id },
            data: { isActive: true },
        });
    }

    async deactivateCustomer(id: string) {
        return this.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }
}