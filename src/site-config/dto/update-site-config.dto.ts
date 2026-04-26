import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSiteConfigItemDto {
  @IsString()
  key: string;

  value: string | number | boolean;
}

export class UpdateSiteConfigBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSiteConfigItemDto)
  configs: UpdateSiteConfigItemDto[];
}