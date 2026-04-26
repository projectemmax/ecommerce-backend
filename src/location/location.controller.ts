/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {

    constructor(private locationService: LocationService) {}

    @Get('regions')
    getRegions() {
        return this.locationService.getRegions();
    }

    @Get('regions/:regionCode/cities')
    getCitiesByRegion(@Param('regionCode') regionCode: string) {
        return this.locationService.getCitiesByRegion(regionCode);
    }

    @Get('regions/:regionCode/provinces')
    getProvinces(@Param('regionCode') regionCode: string) {
        return this.locationService.getProvinces(regionCode);
    }

    @Get('provinces/:provinceCode/cities')
    getCities(@Param('provinceCode') provinceCode: string) {
        return this.locationService.getCities(provinceCode);
    }

    @Get('cities/:cityCode/barangays')
    getBarangays(@Param('cityCode') cityCode: string) {
        return this.locationService.getBarangays(cityCode);
    }

}