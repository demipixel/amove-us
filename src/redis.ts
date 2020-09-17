import * as RedisClient from 'ioredis';

export const Redis = new RedisClient(
  parseInt(process.env.REDIS_PORT || '0', 10) || 6379,
  process.env.REDIS_HOST || '127.0.0.1',
  {
    password: process.env.REDIS_PASSWORD || undefined,
  },
);
