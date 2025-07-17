import express, { Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { jwtValidationMiddleware, requireAdmin, requireMemberOrAdmin, AuthenticatedRequest } from './middleware/jwt';
import {
  rbac,
  requireSuperAdmin,
  requireAdmin as rbacRequireAdmin,
  requireAnalyticsAccess,
  requireOrganizationManagement,
  requireUserManagement,
  requireEventManagement,
  requirePaymentAccess,
  requireResourceAction,
  getAuditLogs,
  getUserPermissions,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  Resource,
  Action,
  Role,
  Permission
} from './middleware/rbac';
import { ipFilterMiddleware } from './middleware/ipFilter';
import { inputSanitizationMiddleware } from './middleware/sanitizer';
import {
  createRateLimitMiddleware,
  authRateLimit,
  loginRateLimit,
  passwordResetRateLimit,
  strictRateLimit,
  lenientRateLimit,
  bypassRateLimit,
  getRateLimitMetrics,
  getRateLimitStatus,
  rateLimitHealthCheck,
  cleanup
} from './middleware/rateLimiter';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));

// Request logging
app.use(morgan('combined'));

// Apply IP filtering middleware
app.use(ipFilterMiddleware());

// Apply input sanitization middleware
app.use(inputSanitizationMiddleware());

// Global rate limiting (IP-based with role-based enhancements)
app.use(createRateLimitMiddleware());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply JWT validation middleware
app.use(jwtValidationMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Gateway routes
const API_VERSION = '/api/v1';

// Authentication service proxy with stricter rate limiting
app.use(`${API_VERSION}/auth/login`, loginRateLimit);
app.use(`${API_VERSION}/auth/reset-password`, passwordResetRateLimit);
app.use(`${API_VERSION}/auth/forgot-password`, passwordResetRateLimit);
app.use(`${API_VERSION}/auth`, authRateLimit, createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    [`^${API_VERSION}/auth`]: '/api/v1/auth',
  },
  onError: (err, req, res) => {
    console.error('Auth Service Error:', err);
    res.status(503).json({ error: 'Authentication service unavailable' });
  },
}));

// User service proxy (with user management permissions)
app.use(`${API_VERSION}/users`, requireUserManagement, createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    [`^${API_VERSION}/users`]: '/api/v1/users',
  },
  onError: (err, req, res) => {
    console.error('User Service Error:', err);
    res.status(503).json({ error: 'User service unavailable' });
  },
}));

// Organization service proxy (Admin only)
app.use(`${API_VERSION}/organizations`, requireOrganizationManagement, createProxyMiddleware({
  target: process.env.ORGANIZATION_SERVICE_URL || 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: {
    [`^${API_VERSION}/organizations`]: '/api/v1/organizations',
  },
  onError: (err, req, res) => {
    console.error('Organization Service Error:', err);
    res.status(503).json({ error: 'Organization service unavailable' });
  },
}));

// Notification service proxy (with notification permissions)
app.use(`${API_VERSION}/notifications`, 
  requireResourceAction(Resource.NOTIFICATION, Action.READ),
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
    changeOrigin: true,
    pathRewrite: {
      [`^${API_VERSION}/notifications`]: '/api/v1/notifications',
    },
    onError: (err, req, res) => {
      console.error('Notification Service Error:', err);
      res.status(503).json({ error: 'Notification service unavailable' });
    },
  })
);

// Membership service proxy (with member management permissions)
app.use(`${API_VERSION}/memberships`,
  requireResourceAction(Resource.MEMBER, Action.READ),
  createProxyMiddleware({
    target: process.env.MEMBERSHIP_SERVICE_URL || 'http://localhost:3006',
    changeOrigin: true,
    pathRewrite: {
      [`^${API_VERSION}/memberships`]: '/api/v1/memberships',
    },
    onError: (err, req, res) => {
      console.error('Membership Service Error:', err);
      res.status(503).json({ error: 'Membership service unavailable' });
    },
  })
);

// Event service proxy (with event permissions)
app.use(`${API_VERSION}/events`,
  requireResourceAction(Resource.EVENT, Action.READ),
  createProxyMiddleware({
    target: process.env.EVENT_SERVICE_URL || 'http://localhost:3007',
    changeOrigin: true,
    pathRewrite: {
      [`^${API_VERSION}/events`]: '/api/v1/events',
    },
    onError: (err, req, res) => {
      console.error('Event Service Error:', err);
      res.status(503).json({ error: 'Event service unavailable' });
    },
  })
);

// Communication service proxy (with communication permissions)
app.use(`${API_VERSION}/communications`,
  requireResourceAction(Resource.COMMUNICATION, Action.READ),
  createProxyMiddleware({
    target: process.env.COMMUNICATION_SERVICE_URL || 'http://localhost:3008',
    changeOrigin: true,
    pathRewrite: {
      [`^${API_VERSION}/communications`]: '/api/v1/communications',
    },
    onError: (err, req, res) => {
      console.error('Communication Service Error:', err);
      res.status(503).json({ error: 'Communication service unavailable' });
    },
  })
);

// Payment service proxy (with payment permissions)
app.use(`${API_VERSION}/payments`,
  requirePaymentAccess,
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3009',
    changeOrigin: true,
    pathRewrite: {
      [`^${API_VERSION}/payments`]: '/api/v1/payments',
    },
    onError: (err, req, res) => {
      console.error('Payment Service Error:', err);
      res.status(503).json({ error: 'Payment service unavailable' });
    },
  })
);

// Analytics service proxy (Admin only)
app.use(`${API_VERSION}/analytics`,
  requireAnalyticsAccess,
  createProxyMiddleware({
    target: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3010',
    changeOrigin: true,
    pathRewrite: {
      [`^${API_VERSION}/analytics`]: '/api/v1/analytics',
    },
    onError: (err, req, res) => {
      console.error('Analytics Service Error:', err);
      res.status(503).json({ error: 'Analytics service unavailable' });
    },
  })
);

// RBAC Management Endpoints
// Audit logs endpoint (Super Admin only)
app.get(`${API_VERSION}/rbac/audit-logs`, requireSuperAdmin, getAuditLogs);

// Get current user's permissions
app.get(`${API_VERSION}/rbac/my-permissions`, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const userPermissions = getUserPermissions(req.user.role, req.user.permissions);
  
  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      organizationId: req.user.organizationId
    },
    permissions: userPermissions,
    roleHierarchy: ROLE_HIERARCHY[req.user.role as Role] || 0
  });
});

// Check specific permission
app.post(`${API_VERSION}/rbac/check-permission`, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const { resource, action } = req.body;
  
  if (!resource || !action) {
    return res.status(400).json({ error: 'Resource and action are required' });
  }
  
  const permission = `${action}:${resource}` as Permission;
  const userPermissions = getUserPermissions(req.user.role, req.user.permissions);
  const hasAccess = userPermissions.includes(permission);
  
  return res.json({
    hasPermission: hasAccess,
    permission,
    userRole: req.user.role,
    userPermissions
  });
});

// Get role hierarchy information (Admin only)
app.get(`${API_VERSION}/rbac/roles`, rbacRequireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const roleInfo = Object.entries(ROLE_HIERARCHY).map(([role, level]) => ({
    role,
    level,
    permissions: ROLE_PERMISSIONS[role as Role] || []
  }));
  
  return res.json({
    roles: roleInfo,
    hierarchy: ROLE_HIERARCHY
  });
});

// Rate Limiting Management Endpoints
// Get rate limiting metrics (Super Admin only)
app.get(`${API_VERSION}/rate-limit/metrics`, requireSuperAdmin, getRateLimitMetrics);

// Get current user's rate limit status
app.get(`${API_VERSION}/rate-limit/status`, getRateLimitStatus);

// Rate limiting health check
app.get(`${API_VERSION}/rate-limit/health`, rateLimitHealthCheck);

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed.');
    
    try {
      // Cleanup rate limiting resources
      await cleanup();
      console.log('Rate limiting cleanup completed.');
      
      // Exit the process
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force shutdown after timeout
  setTimeout(() => {
    console.log('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000); // 30 second timeout
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
