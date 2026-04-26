import { IsNotEmpty } from 'class-validator';

export class CreateCustomerAddressDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;

  city?: string;
  province?: string;

}