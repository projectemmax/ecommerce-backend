import { Module } from '@nestjs/common';
import { AccountDashboardService } from './account-dashboard.service';
import { AccountDashboardController } from './account-dashboard.controller';

@Module({
  controllers: [AccountDashboardController],
  providers: [AccountDashboardService],
})
export class AccountDashboardModule {}
