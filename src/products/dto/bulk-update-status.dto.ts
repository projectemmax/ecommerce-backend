import { IsArray, IsString, ArrayNotEmpty, IsIn } from 'class-validator';

export class BulkUpdateStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  ids: string[];

  @IsString()
  @IsIn(['DRAFT', 'PUBLISHED'])
  status: 'DRAFT' | 'PUBLISHED';
}