import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { AdminCategoriesController } from './admin-categories.controller';
import { StorefrontCategoriesController } from './storefront-categories.controller';

@Module({
  controllers: [AdminCategoriesController, StorefrontCategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}