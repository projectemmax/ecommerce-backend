import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class AdminOrdersQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';
}