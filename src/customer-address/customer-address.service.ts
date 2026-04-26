/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class CustomerAddressService {

    constructor(private prisma: PrismaService) {}

    async getAddresses(userId: string) {
        const customer = await this.getCustomerProfile(userId);

        return this.prisma.customerAddress.findMany({
            where: { customerId: customer.id },
            orderBy: { createdAt: 'desc' }
        });
    }

    async createAddress(userId: string, dto: any) {
        const customer = await this.getCustomerProfile(userId);

        return this.prisma.customerAddress.create({
            data: {
                ...dto,
                customerId: customer.id
            }
        });
    }

    async updateAddress(id: string, dto: any) {
        return this.prisma.customerAddress.update({
            where: { id },
            data: dto
        });
    }

    async deleteAddress(id: string) {
        return this.prisma.customerAddress.delete({
            where: { id }
        });
    }

    async setDefault(userId: string, id: string) {
        const customer = await this.getCustomerProfile(userId);

        await this.prisma.customerAddress.updateMany({
            where: { customerId: customer.id },
            data: { isDefault: false }
        });

        return this.prisma.customerAddress.update({
            where: { id },
            data: { isDefault: true }
        });
    }

    private async getCustomerProfile(userId: string) {
        const customer = await this.prisma.customerProfile.findUnique({
            where: { userId }
        });

        if (!customer) {
            throw new NotFoundException(
            'Customer profile not found. Please complete your account profile first.'
            );
        }

        return customer;
    }

}
