import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Import configurations and middleware
import { config } from '@/config/app';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/api/middleware/errorHandler';
import { notFound } from '@/api/middleware/notFound';
import { rateLimiter } from '@/api/middleware/rateLimiter';
import { apiRoutes } from '@/api/routes';
import { setupSwagger } from '@/config/swagger';
import { connectDatabase } from '@/config/database';
import { connectRedis } from '@/config/redis';
import { setupSocketIO } from '@/config/socket';

// Create Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  },
});

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use(config.apiPrefix, apiRoutes);

// Setup Swagger documentation
if (config.swagger.enabled) {
  setupSwagger(app);
}

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Initialize services
async function initializeServices() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Connect to Redis
    await connectRedis();
    logger.info('Redis connected successfully');

    // Setup Socket.IO
    setupSocketIO(io);
    logger.info('Socket.IO initialized');

    // Start server
    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`API Documentation: http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Initialize and start the application
initializeServices();
