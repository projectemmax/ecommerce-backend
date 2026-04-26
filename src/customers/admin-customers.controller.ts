/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminCustomersService } from './admin-customers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/customers')
export class AdminCustomersController {
    constructor(
        private readonly adminCustomersService: AdminCustomersService,
    ) {}

    @Get()
    async getCustomers() {
        try {
            const customers = await this.adminCustomersService.getCustomers();
            return {
                result: true,
                data: customers,
            };
        } catch (error) {
            throw new HttpException(
                {
                    result: false,
                    message: 'Failed to fetch customers',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch(':id/activate')
    async activateCustomer(@Param('id') id: string) {
        try {
            await this.adminCustomersService.activateCustomer(id);
            return { result: true };
        } catch (error) {
            throw new HttpException(
                {
                    result: false,
                    message: 'Failed to activate customer',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch(':id/deactivate')
    async deactivateCustomer(@Param('id') id: string) {
        try {
            await this.adminCustomersService.deactivateCustomer(id);
            return { result: true };
        } catch (error) {
            throw new HttpException(
                {
                result: false,
                message: 'Failed to deactivate customer',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}