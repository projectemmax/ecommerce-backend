/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async getStorefrontCategories() {
        const categories = await this.prisma.category.findMany({
            where: {
                isActive: true,
                deletedAt: null,
            },
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: {
                        products: {
                            where: { isActive: true },
                        },
                    },
                },
            },
        });

        return {
            data: categories.map((c) => ({
                id: c.id,
                name: c.name,
                productCount: c._count.products,
                variantTemplate: c.variantTemplate,
            })),
        };
    }

    // ==========================
    // ADMIN: GET
    // ==========================
    async getAdminCategories() {
        return {
            data: await this.prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
            }),
        };
    }

    // ==========================
    // ADMIN: CREATE
    // ==========================
    async createCategory(body: any) {
        const { name, isActive = true } = body;

        if (!name?.trim()) {
            throw new BadRequestException('Name is required');
        }

        // 🔥 CLEAN TEMPLATE HERE
        const cleanTemplate = {
            attributes:
                body.variantTemplate?.attributes
                ?.filter((v) => v?.trim())
                .map((v) => v.trim()) ?? [],
        };

        try {
            const category = await this.prisma.category.create({
                data: {
                    name: name.trim(),
                    isActive,
                    variantTemplate: cleanTemplate, // ✅ USE CLEANED DATA
                },
            });

            return {
                message: 'Category created',
                data: category,
            };
        } catch (err) {
            if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                err.code === 'P2002'
            ) {
                throw new ConflictException('Category name already exists');
            }
            throw err;
        }
    }

    // ==========================
    // ADMIN: UPDATE
    // ==========================
    async updateCategory(
        id: string,
        body: { 
            name?: string; 
            isActive?: boolean;
            variantTemplate?: {
                attributes: string[];
            }; 
        },
    ) {
        try {
            const cleanTemplate = {
                attributes:
                    body.variantTemplate?.attributes
                    ?.filter((v) => v?.trim())
                    .map((v) => v.trim()) ?? [],
            };

            const category = await this.prisma.category.update({
                where: { id },
                data: {
                    name: body.name,
                    isActive: body.isActive,
                    variantTemplate: cleanTemplate
                },
            });

            return {
                message: 'Category updated',
                data: category,
            };
        } catch (err) {
            if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                err.code === 'P2002'
            ) {
                throw new ConflictException('Category name already exists');
            }
            throw err;
        }
    }

    // ==========================
    // ADMIN: SOFT DELETE
    // ==========================
    async softDeleteCategory(id: string) {
        const category = await this.prisma.category.findUnique({ where: { id } });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        await this.prisma.category.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }
}