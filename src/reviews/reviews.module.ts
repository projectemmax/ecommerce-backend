import { Module } from '@nestjs/common';
import { StorefrontReviewsController } from './storefront-reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminReviewsController } from './admin-reviews.controller';

@Module({
  imports: [PrismaModule],
  controllers: [StorefrontReviewsController, AdminReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}