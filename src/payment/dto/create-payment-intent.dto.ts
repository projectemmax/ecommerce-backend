import { IsEnum, IsUUID } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentIntentDto {
  @IsUUID()
  orderId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}