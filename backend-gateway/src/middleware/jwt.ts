import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extended request interface to include user data
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
    permissions?: string[];
  };
}

// JWT payload interface
interface JWTPayload {
  id: string;
  userId?: string;
  email: string;
  role: string;
  organizationId?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

// Configuration
const jwtSecret = process.env.JWT_SECRET || 'your-default-secret-key';
const jwtIssuer = process.env.JWT_ISSUER || 'memberport-gateway';

// Public routes that don't require authentication
const publicRoutes = [
  '/health',
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/reset-password',
  '/api/v1/auth/verify-email',
  '/api/v1/auth/refresh-token',
  '/api/v1/rate-limit/health'
];

// Check if route is public
const isPublicRoute = (path: string): boolean => {
  return publicRoutes.some(route => path.startsWith(route));
};

// JWT validation middleware
export const jwtValidationMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Skip JWT validation for public routes
  if (isPublicRoute(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.verify(token, jwtSecret, {
      issuer: jwtIssuer
    }) as JWTPayload;

    // Attach user information to request
    req.user = {
      id: decoded.id || decoded.userId || '',
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organizationId,
      permissions: decoded.permissions || []
    };
    
    // Add user information to headers for downstream services
    req.headers['x-user-id'] = req.user.id;
    req.headers['x-user-role'] = req.user.role;
    req.headers['x-user-email'] = req.user.email;
    req.headers['x-user-org-id'] = req.user.organizationId || '';
    req.headers['x-user-permissions'] = JSON.stringify(req.user.permissions);
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    } else {
      console.error('JWT validation error:', error);
      return res.status(401).json({ 
        error: 'Token validation failed',
        code: 'VALIDATION_FAILED'
      });
    }
  }
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: req.user.role
      });
    }

    return next();
  };
};

// Permission-based access control middleware
export const requirePermission = (requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: requiredPermissions,
        current: userPermissions
      });
    }

    return next();
  };
};

// Admin-only middleware
export const requireAdmin = requireRole(['admin', 'super-admin']);

// Member or Admin middleware
export const requireMemberOrAdmin = requireRole(['member', 'admin', 'super-admin', 'pension-officer']);

// Organization-specific access middleware
export const requireSameOrganization = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  // Extract organization ID from request params or body
  const requestOrgId = req.params.organizationId || req.body.organizationId;
  
  // Super admins can access any organization
  if (req.user.role === 'super-admin') {
    return next();
  }

  // Check if user belongs to the same organization
  if (req.user.organizationId !== requestOrgId) {
    return res.status(403).json({ 
      error: 'Access denied. Organization mismatch',
      code: 'ORG_MISMATCH'
    });
  }

  return next();
};

// Token refresh validation (for refresh token endpoints)
export const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.body.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ 
      error: 'Refresh token required',
      code: 'NO_REFRESH_TOKEN'
    });
  }

  try {
    // Verify refresh token (you might want to use a different secret for refresh tokens)
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || jwtSecret);
    req.body.decodedRefreshToken = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid refresh token',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
};
