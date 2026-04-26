import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {

    private redis: Redis;

    constructor() {
        this.redis = new Redis({
        host: '127.0.0.1',
        port: 6379,
        });
    }

    getClient() {
        return this.redis;
    }

}