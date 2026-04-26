import {
  Controller,
  Patch,
  Get,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin Reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/reviews')
export class AdminReviewsController {

  constructor(private readonly reviewsService: ReviewsService) {}

  // Pending moderation queue
  @Get('pending')
  getPendingReviews() {
    return this.reviewsService.getReviewsByStatus('PENDING');
  }

  // Approved reviews
  @Get('approved')
  getApprovedReviews() {
    return this.reviewsService.getReviewsByStatus('APPROVED');
  }

  // Rejected reviews
  @Get('rejected')
  getRejectedReviews() {
    return this.reviewsService.getReviewsByStatus('REJECTED');
  }

  // Approve review
  @Patch(':id/approve')
  approveReview(@Param('id') id: string) {
    return this.reviewsService.updateStatus(id, 'APPROVED');
  }

  // Reject review
  @Patch(':id/reject')
  rejectReview(@Param('id') id: string) {
    return this.reviewsService.updateStatus(id, 'REJECTED');
  }

  @Patch('bulk-approve')
  bulkApprove(@Body() body: { ids: string[] }) {
    return this.reviewsService.bulkUpdateStatus(body.ids, 'APPROVED');
  }

  @Patch('bulk-reject')
  bulkReject(@Body() body: { ids: string[] }) {
    return this.reviewsService.bulkUpdateStatus(body.ids, 'REJECTED');
  }

}