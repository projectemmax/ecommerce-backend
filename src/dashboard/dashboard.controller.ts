import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('analytics')
  getAnalytics(@Query('range') range: string = '7D') {
    return this.dashboardService.getAnalytics(range);
  }

  @Get('top-products')
  getTopProducts() {
    return this.dashboardService.getTopProducts();
  }

  @Get('latest-customers')
  getLatestCustomers() {
    return this.dashboardService.getLatestCustomers();
  }

  @Get('pending-reviews')
  getPendingReviews() {
    return this.dashboardService.getPendingReviews();
  }


}