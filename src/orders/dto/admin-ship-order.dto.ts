import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

enum ShippingMethod {
  DROP_OFF = 'drop_off',
  PICKUP = 'pickup',
}

export class AdminShipOrderDto {
  @IsOptional()
  @IsString()
  courierName?: string;

  @IsOptional()
  @IsString()
  courierCode?: string;

  @IsString()
  trackingNumber: string;

  @IsOptional()
  @IsEnum(ShippingMethod)
  shippingMethod?: ShippingMethod;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  shippingFee?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
