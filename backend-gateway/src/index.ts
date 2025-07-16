import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { jwtValidationMiddleware, requireAdmin, requireMemberOrAdmin, AuthenticatedRequest } from './middleware/jwt';

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

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

// Authentication service proxy
app.use(`${API_VERSION}/auth`, createProxyMiddleware({
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

// User service proxy
app.use(`${API_VERSION}/users`, createProxyMiddleware({
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
app.use(`${API_VERSION}/organizations`, requireAdmin, createProxyMiddleware({
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

// Notification service proxy
app.use(`${API_VERSION}/notifications`, createProxyMiddleware({
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
  changeOrigin: true,
  pathRewrite: {
    [`^${API_VERSION}/notifications`]: '/api/v1/notifications',
  },
  onError: (err, req, res) => {
    console.error('Notification Service Error:', err);
    res.status(503).json({ error: 'Notification service unavailable' });
  },
}));

// Membership service proxy
app.use(`${API_VERSION}/memberships`, createProxyMiddleware({
  target: process.env.MEMBERSHIP_SERVICE_URL || 'http://localhost:3006',
  changeOrigin: true,
  pathRewrite: {
    [`^${API_VERSION}/memberships`]: '/api/v1/memberships',
  },
  onError: (err, req, res) => {
    console.error('Membership Service Error:', err);
    res.status(503).json({ error: 'Membership service unavailable' });
  },
}));

// Event service proxy
app.use(`${API_VERSION}/events`, createProxyMiddleware({
  target: process.env.EVENT_SERVICE_URL || 'http://localhost:3007',
  changeOrigin: true,
  pathRewrite: {
    [`^${API_VERSION}/events`]: '/api/v1/events',
  },
  onError: (err, req, res) => {
    console.error('Event Service Error:', err);
    res.status(503).json({ error: 'Event service unavailable' });
  },
}));

// Communication service proxy
app.use(`${API_VERSION}/communications`, createProxyMiddleware({
  target: process.env.COMMUNICATION_SERVICE_URL || 'http://localhost:3008',
  changeOrigin: true,
  pathRewrite: {
    [`^${API_VERSION}/communications`]: '/api/v1/communications',
  },
  onError: (err, req, res) => {
    console.error('Communication Service Error:', err);
    res.status(503).json({ error: 'Communication service unavailable' });
  },
}));

// Payment service proxy
app.use(`${API_VERSION}/payments`, createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3009',
  changeOrigin: true,
  pathRewrite: {
    [`^${API_VERSION}/payments`]: '/api/v1/payments',
  },
  onError: (err, req, res) => {
    console.error('Payment Service Error:', err);
    res.status(503).json({ error: 'Payment service unavailable' });
  },
}));

// Analytics service proxy (Admin only)
app.use(`${API_VERSION}/analytics`, requireAdmin, createProxyMiddleware({
  target: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3010',
  changeOrigin: true,
  pathRewrite: {
    [`^${API_VERSION}/analytics`]: '/api/v1/analytics',
  },
  onError: (err, req, res) => {
    console.error('Analytics Service Error:', err);
    res.status(503).json({ error: 'Analytics service unavailable' });
  },
}));

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
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
