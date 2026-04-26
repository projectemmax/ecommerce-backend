/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class StorefrontCategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    getStorefrontCategories() {
        return this.categoriesService.getStorefrontCategories();
    }
}