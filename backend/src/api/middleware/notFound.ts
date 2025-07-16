import { Request, Response, NextFunction } from 'express';

// Not found middleware
export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    error: 'Resource not found',
  });
}

