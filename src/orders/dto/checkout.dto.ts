import { IsEnum, IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CheckoutDto {

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsNumber()
  shippingFee: number;

  @IsString()
  shippingName: string;

  @IsString()
  shippingPhone: string;

  @IsString()
  shippingAddress: string;

  @IsString()
  shippingCity: string;

  @IsString()
  shippingProvince: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  messageForSeller?: string;

}