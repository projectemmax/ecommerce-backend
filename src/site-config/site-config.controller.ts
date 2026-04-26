/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Patch,
  Param,
  Body
} from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { UpdateSiteConfigBulkDto } from './dto/update-site-config.dto';

@Controller('site-config')
export class SiteConfigController {
    constructor(private service: SiteConfigService) {}

    // =========================
    // PUBLIC (STORE)
    // =========================
    @Get('public')
    getPublicConfig() {
        return this.service.getPublicConfig();
    }

    // =========================
    // ADMIN: GET ALL
    // =========================
    @Get()
    getAllConfigs() {
        return this.service.getAllConfigs();
    }

    // =========================
    // GET SINGLE
    // =========================
    @Get(':key')
    getConfig(@Param('key') key: string) {
        return this.service.getConfig(key);
    }

    // =========================
    // UPDATE SINGLE
    // =========================
    @Patch(':key')
    updateConfig(
        @Param('key') key: string,
        @Body() body: { value: any }
    ) {
        return this.service.updateConfig(key, body.value);
    }

    // =========================
    // BULK UPDATE 🔥
    // =========================
    @Patch()
    updateBulk(@Body() body: UpdateSiteConfigBulkDto) {
        return this.service.updateBulk(body.configs);
    }
    
}