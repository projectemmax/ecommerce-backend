/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaymentMethod } from '@prisma/client';


@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    // ✅ Create payment (initial)
    @UseGuards(JwtAuthGuard)
  @Post()
  createPayment(@Body() dto: CreatePaymentIntentDto, @Req() req) {
    return this.paymentService.createPayment(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':orderId/retry')
  retryPayment(
    @Param('orderId') orderId: string,
    @Req() req,
    @Body() body: { paymentMethod?: PaymentMethod },
  ) {
    return this.paymentService.retryPayment(
      orderId,
      req.user.id,
      body.paymentMethod,
    );
  }

  @Get('order/:orderId')
  getAttempts(@Param('orderId') orderId: string) {
    return this.paymentService.getAttempts(orderId);
  }
}