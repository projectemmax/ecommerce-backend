import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'DRAFT';
}