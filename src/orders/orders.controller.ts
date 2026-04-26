/* eslint-disable prettier/prettier */
import { Controller, Get, Req, UseGuards, Param, Query, Patch, Body, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { AdminUpdateOrderStatusDto } from './dto/admin-update-order-status.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/interfaces/auth-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('my')
    getMyOrders(
        @Req() req,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('status') status?: string,
    ) {
        return this.ordersService.getMyOrders(
            req.user.id,
            Number(page),
            Number(limit),
            status,
        );
    }

    @Get()
    getOrders(
        @Req() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.ordersService.getOrderHistory(
        req.user.userId,
        Number(page) || 1,
        Number(limit) || 10,
        );
    }

    @Post(':id/reorder')
    reorder(
        @CurrentUser() user: AuthUser,
        @Param('id') orderId: string
    ) {
        return this.ordersService.reorder(user.id, orderId);
    }

    @Get(':id')
    getOrder(
        @Req() req: any,
        @Param('id') orderId: string,
    ) {
        return this.ordersService.getOrderById(req.user.userId, orderId);
    }

    @Patch(':id/status')
    updateOrderStatus(
        @Param('id') orderId: string,
        @Body() dto: AdminUpdateOrderStatusDto,
    ) {
        return this.ordersService.updateOrderStatus(orderId, dto.status);
    }

    // -------------------------
    // POST /cart/checkout
    // -------------------------
    @Post('checkout')
    checkout(
        @CurrentUser() user: AuthUser,
        @Body() dto: CheckoutDto
    ) {
        return this.ordersService.checkout(user.id, dto);
    }



}