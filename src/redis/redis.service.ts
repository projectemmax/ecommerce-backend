import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      console.warn('⚠️ REDIS_URL not set. Redis disabled.');
      return;
    }

    this.redis = new Redis(redisUrl, {
      tls: {}, // ✅ REQUIRED for rediss:// (Upstash)
    });

    this.redis.on('connect', () => {
      console.log('✅ Redis connected');
    });

    this.redis.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
    });
  }

  getClient() {
    return this.redis ?? null;
  }
}