import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AccountDashboardService } from './account-dashboard.service';

@Controller('account/dashboard')
export class AccountDashboardController {
    constructor(private readonly service: AccountDashboardService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    getDashboard(@Req() req) {
        return this.service.getDashboard(req.user.id);
    }
}