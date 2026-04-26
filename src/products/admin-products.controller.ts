/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProductsService } from './products.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetProductsDto } from './dto/get-products.dto';
import { BulkUpdateStatusDto } from './dto/bulk-update-status.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

    // GET /api/admin/products
    @Get()
    getProducts(@Query() query: GetProductsDto) {
        return this.productsService.getAdminProducts(query);
    }

    @Patch('bulk-status')
    bulkUpdateStatus(@Body() body: BulkUpdateStatusDto) {
        return this.productsService.bulkUpdateStatus(body);
    }

    // GET /api/admin/products/:id
    @Get(':id')
    getProductById(@Param('id') id: string) {
        return this.productsService.getProductById(id);
    }

    // POST /api/admin/products
    @Post()
    createProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }

    // PATCH /api/admin/products/:id
    @Put(':id')
    updateProduct(
        @Param('id') id: string,
        @Body() body: UpdateProductDto
    ) {
        return this.productsService.updateProduct(id, body);
    }

    // DELETE /api/admin/products/:id
    @Delete(':id')
    @HttpCode(204)
    async deleteProduct(@Param('id') id: string): Promise<void> {
        await this.productsService.softDeleteProduct(id);
    }

    // POST /api/admin/products/:id/image
    @Post(':id/image')
    @UseInterceptors(
    FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, cb) => {
                const uniqueName =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
                const extension = extname(file.originalname);
                cb(null, `${uniqueName}${extension}`);
            },
        }),

        // ✅ FILE SIZE LIMIT (5MB example)
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB
        },

        // ✅ FILE TYPE VALIDATION
        fileFilter: (req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|webp/;
        const ext = extname(file.originalname).toLowerCase();
        const mime = file.mimetype;

        if (
            allowedTypes.test(ext) &&
            allowedTypes.test(mime)
        ) {
            cb(null, true);
        } else {
            cb(
            new BadRequestException(
                'Only JPG, JPEG, PNG, WEBP images are allowed',
            ),
            false,
            );
        }
        },
    }),
    )
    uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    ) {
        return this.productsService.uploadProductImage(id, file);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + Math.random();
            cb(null, uniqueName + extname(file.originalname));
            }
        })
    }))
    uploadTemp(@UploadedFile() file: Express.Multer.File) {
        return {
            url: `/uploads/products/${file.filename}`
        };
    }


    // PATCH /api/admin/products/:id/restore
    @Patch(':id/restore')
    @HttpCode(204)
    async restoreProduct(@Param('id') id: string): Promise<void> {
        await this.productsService.restoreProduct(id);
    }

    // DELETE /api/admin/products/:id/permanent
    @Delete(':id/permanent')
    @HttpCode(204)
    async hardDeleteProduct(@Param('id') id: string): Promise<void> {
        await this.productsService.hardDeleteProduct(id);
    }

}