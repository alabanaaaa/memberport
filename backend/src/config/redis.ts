import { createClient } from 'redis';
import { config } from '@/config/app';
import { logger } from '@/utils/logger';

const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  password: config.redis.password,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

export async function connectRedis() {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Redis connection failed:', error);
  }
}

export async function disconnectRedis() {
  try {
    await redisClient.disconnect();
    logger.info('Redis disconnected successfully');
  } catch (error) {
    logger.error('Redis disconnection failed:', error);
  }
}

export { redisClient };
