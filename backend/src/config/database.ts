import { PrismaClient } from '@prisma/client';
import { config } from '@/config/app';
import { logger } from '@/utils/logger';

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.database.url,
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Log database queries in development
    if (config.nodeEnv === 'development') {
      this.prisma.$on('query', (e) => {
        logger.debug('Query: ' + e.query);
        logger.debug('Params: ' + e.params);
        logger.debug('Duration: ' + e.duration + 'ms');
      });
    }

    this.prisma.$on('error', (e) => {
      logger.error('Database error: ' + e.message);
    });

    this.prisma.$on('info', (e) => {
      logger.info('Database info: ' + e.message);
    });

    this.prisma.$on('warn', (e) => {
      logger.warn('Database warning: ' + e.message);
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Database disconnection failed:', error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }
}

export const databaseService = DatabaseService.getInstance();
export const prisma = databaseService.getClient();

export async function connectDatabase(): Promise<void> {
  await databaseService.connect();
}

export async function disconnectDatabase(): Promise<void> {
  await databaseService.disconnect();
}
