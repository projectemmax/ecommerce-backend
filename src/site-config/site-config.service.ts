/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiteConfigService {
    constructor(private prisma: PrismaService) {}

    // =========================
    // PUBLIC (TRANSFORMED)
    // =========================
    async getPublicConfig() {
        const configs = await this.prisma.siteConfig.findMany({
        where: { isPublic: true },
        });

        const result: Record<string, any> = {};

        for (const c of configs) {
        result[c.key] = c.value;
        }

        return result;
    }

    // =========================
    // ADMIN (RAW LIST)
    // =========================
    async getAllConfigs() {
        return this.prisma.siteConfig.findMany({
        orderBy: { key: 'asc' },
        });
    }

    // =========================
    // GET SINGLE
    // =========================
    async getConfig(key: string) {
        return this.prisma.siteConfig.findUnique({
        where: { key },
        });
    }

    // =========================
    // UPDATE SINGLE
    // =========================
    async updateConfig(key: string, value: any) {
        const validatedValue = this.validateConfigValue(key, value);

        return this.prisma.siteConfig.upsert({
            where: { key },
            update: { value: validatedValue },
            create: {
                key,
                value: validatedValue,
                isPublic: true,
            },
        });
    }

    // =========================
    // BULK UPDATE 🔥
    // =========================
    async updateBulk(configs: { key: string; value: any }[]) {
        return Promise.all(
            configs.map((c) => {
            const validatedValue = this.validateConfigValue(c.key, c.value);

            return this.prisma.siteConfig.upsert({
                where: { key: c.key },
                update: { value: validatedValue },
                create: {
                    key: c.key,
                    value: validatedValue,
                    isPublic: true,
                },
            });
            }),
        );
    }

    private validateConfigValue(key: string, value: any) {
        const numericKeys = [
            'shipping.baseFee',
            'shipping.freeThreshold',
            'shipping.sameProvinceFee',
            'shipping.otherProvinceFee',
        ];

        if (numericKeys.includes(key)) {
            const parsed = Number(value);

            if (Number.isNaN(parsed) || parsed < 0) {
            throw new BadRequestException(`${key} must be a valid positive number`);
            }

            return parsed;
        }

        if (key === 'shipping.enableFreeShipping') {
            if (typeof value !== 'boolean') {
            throw new BadRequestException(`${key} must be true or false`);
            }

            return value;
        }

        return value;
    }

}