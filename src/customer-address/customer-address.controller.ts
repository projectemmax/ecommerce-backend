import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CustomerAddressService } from './customer-address.service';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer/addresses')
export class CustomerAddressController {

    constructor(private service: CustomerAddressService) {}

    @Get()
    getAddresses(@Req() req) {
        return this.service.getAddresses(req.user.id);
    }

    @Post()
    createAddress(@Req() req, @Body() body) {
        return this.service.createAddress(req.user.id, body);
    }

    @Patch(':id')
    updateAddress(
        @Param('id') id: string,
        @Body() body,
    ) {
        return this.service.updateAddress(id, body);
    }

    @Delete(':id')
    deleteAddress(@Param('id') id: string) {
        return this.service.deleteAddress(id);
    }

    @Patch(':id/default')
    setDefault(
        @Req() req,
        @Param('id') id: string,
    ) {
        return this.service.setDefault(req.user.id, id);
    }

}
