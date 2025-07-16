import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/app';
import { prisma } from '@/config/database';
import { createError } from '@/api/middleware/errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        memberNumber?: string;
        isActive: boolean;
      };
    }
  }
}

// Authentication middleware
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw createError('Access denied. No token provided.', 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        memberNumber: true,
        isActive: true,
      },
    });

    if (!user) {
      throw createError('Invalid token.', 401);
    }

    if (!user.isActive) {
      throw createError('Account is disabled.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// Authorization middleware factory
export function authorize(roles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Access denied. Authentication required.', 401));
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(createError('Access denied. Insufficient permissions.', 403));
    }

    next();
  };
}

// Optional authentication middleware
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          role: true,
          memberNumber: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
}

// Admin-only middleware
export const adminOnly = authorize(['Super Admin', 'Admin']);

// Member or admin middleware
export const memberOrAdmin = authorize(['Member', 'Admin', 'Super Admin']);

// Pension officer and above middleware
export const pensionOfficerOrAbove = authorize(['Pension Officer', 'Finance Officer', 'Admin', 'Super Admin']);

// Self or admin middleware (for accessing own data)
export function selfOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(createError('Access denied. Authentication required.', 401));
  }

  const resourceUserId = req.params.id || req.params.userId;
  const isAdmin = ['Admin', 'Super Admin'].includes(req.user.role);
  const isSelf = req.user.id === resourceUserId;

  if (!isAdmin && !isSelf) {
    return next(createError('Access denied. You can only access your own data.', 403));
  }

  next();
}
