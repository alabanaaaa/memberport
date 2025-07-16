import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { config } from '@/config/app';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

// Global error handler
export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database error';
  }

  if (err.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
  }

  // Prepare error response
  const errorResponse: any = {
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
  };

  // Include additional details in development
  if (config.nodeEnv === 'development') {
    errorResponse.details = {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
      details: err.details,
    };
  }

  res.status(statusCode).json(errorResponse);
}

// Async error handler wrapper
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Create custom error
export function createError(message: string, statusCode: number = 500, code?: string) {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}
