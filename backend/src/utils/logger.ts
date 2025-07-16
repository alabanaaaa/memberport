import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '@/config/app';

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

// Custom log format for console
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      ),
    }),
    
    // File transport for all logs
    new DailyRotateFile({
      filename: 'logs/memberport-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: config.logging.file.maxSize,
      maxFiles: config.logging.file.maxFiles,
      zippedArchive: true,
    }),
    
    // Separate file for errors
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: config.logging.file.maxSize,
      maxFiles: config.logging.file.maxFiles,
      zippedArchive: true,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// Create a stream object with a 'write' function for morgan
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger, stream };
