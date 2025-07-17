import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { AuthenticatedRequest } from './jwt';
import { Role } from './rbac';

// Using in-memory rate limiting for simplicity
const isRedisConnected = false;

// Rate limit configurations
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyPrefix?: string;
}

// Default rate limit configurations
const DEFAULT_LIMITS: Record<string, RateLimitConfig> = {
  // Global IP-based limits
  global: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    keyPrefix: 'global_ip',
  },
  
  // Authentication endpoint limits (stricter)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per window
    keyPrefix: 'auth_ip',
  },
  
  // Password reset limits (very strict)
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour
    keyPrefix: 'pwd_reset_ip',
  },
  
  // Login limits (strict)
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 login attempts per window
    keyPrefix: 'login_ip',
  },
};

// Role-based rate limits
const ROLE_LIMITS: Record<Role, RateLimitConfig> = {
  [Role.GUEST]: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per window
    keyPrefix: 'role_guest',
  },
  [Role.MEMBER]: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per window
    keyPrefix: 'role_member',
  },
  [Role.PENSION_OFFICER]: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 requests per window
    keyPrefix: 'role_pension_officer',
  },
  [Role.ADMIN]: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    keyPrefix: 'role_admin',
  },
  [Role.SUPER_ADMIN]: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // 5000 requests per window
    keyPrefix: 'role_super_admin',
  },
};

// Endpoint-specific rate limits
const ENDPOINT_LIMITS: Record<string, RateLimitConfig> = {
  '/api/v1/payments': {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 payment requests per minute
    keyPrefix: 'endpoint_payments',
  },
  '/api/v1/analytics': {
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 analytics requests per minute
    keyPrefix: 'endpoint_analytics',
  },
  '/api/v1/users': {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 user requests per minute
    keyPrefix: 'endpoint_users',
  },
  '/api/v1/organizations': {
    windowMs: 60 * 1000, // 1 minute
    max: 50, // 50 organization requests per minute
    keyPrefix: 'endpoint_organizations',
  },
};

// Rate limiter instances cache
const rateLimiterCache = new Map<string, RateLimiterMemory>();

// Create rate limiter instance
const createRateLimiter = (config: RateLimitConfig): RateLimiterMemory => {
  const cacheKey = `${config.keyPrefix}_${config.windowMs}_${config.max}`;
  
  if (rateLimiterCache.has(cacheKey)) {
    return rateLimiterCache.get(cacheKey)!;
  }

  const limiterOptions = {
    keyPrefix: config.keyPrefix,
    points: config.max,
    duration: Math.floor(config.windowMs / 1000), // Convert to seconds
    blockDuration: Math.floor(config.windowMs / 1000), // Block for the same duration
    execEvenly: true, // Spread requests evenly across the window
  };

  // Use in-memory rate limiter
  const rateLimiter = new RateLimiterMemory(limiterOptions);

  rateLimiterCache.set(cacheKey, rateLimiter);
  return rateLimiter;
};

// Rate limiting metrics
interface RateLimitMetrics {
  totalRequests: number;
  blockedRequests: number;
  lastResetTime: Date;
  topBlockedIPs: Map<string, number>;
  topBlockedUsers: Map<string, number>;
}

const metrics: RateLimitMetrics = {
  totalRequests: 0,
  blockedRequests: 0,
  lastResetTime: new Date(),
  topBlockedIPs: new Map(),
  topBlockedUsers: new Map(),
};

// Reset metrics daily
setInterval(() => {
  metrics.totalRequests = 0;
  metrics.blockedRequests = 0;
  metrics.lastResetTime = new Date();
  metrics.topBlockedIPs.clear();
  metrics.topBlockedUsers.clear();
}, 24 * 60 * 60 * 1000); // 24 hours

// Extract client IP address
const getClientIP = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const realIP = req.headers['x-real-ip'] as string;
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return req.connection.remoteAddress || req.socket.remoteAddress || req.ip || 'unknown';
};

// Extract user identifier
const getUserIdentifier = (req: AuthenticatedRequest): string => {
  if (req.user?.id) {
    return `user_${req.user.id}`;
  }
  
  // Extract token from authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return `token_${token.substring(0, 10)}...`; // Use first 10 chars for privacy
  }
  
  return `anonymous_${getClientIP(req)}`;
};

// Check multiple rate limiters
const checkRateLimit = async (
  req: AuthenticatedRequest,
  limiters: { limiter: RateLimiterMemory; key: string; type: string }[]
): Promise<{ blocked: boolean; limitInfo?: any; blockedBy?: string }> => {
  for (const { limiter, key, type } of limiters) {
    try {
      await limiter.consume(key);
    } catch (rejRes: any) {
      // Rate limit exceeded
      const remainingPoints = rejRes.remainingPoints || 0;
      const msBeforeNext = rejRes.msBeforeNext || 0;
      const totalRequests = rejRes.consumedPoints || 0;
      
      // Update metrics
      metrics.blockedRequests++;
      
      if (type === 'ip') {
        const count = metrics.topBlockedIPs.get(key) || 0;
        metrics.topBlockedIPs.set(key, count + 1);
      } else if (type === 'user') {
        const count = metrics.topBlockedUsers.get(key) || 0;
        metrics.topBlockedUsers.set(key, count + 1);
      }
      
      return {
        blocked: true,
        limitInfo: {
          limit: limiter.points,
          remaining: remainingPoints,
          reset: new Date(Date.now() + msBeforeNext),
          retryAfter: Math.round(msBeforeNext / 1000),
          totalRequests,
        },
        blockedBy: type,
      };
    }
  }
  
  return { blocked: false };
};

// Main rate limiting middleware factory
export const createRateLimitMiddleware = (
  config?: Partial<RateLimitConfig>,
  options?: {
    skipIP?: boolean;
    skipUser?: boolean;
    skipRole?: boolean;
    skipEndpoint?: boolean;
    customLimits?: RateLimitConfig[];
  }
) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      metrics.totalRequests++;
      
      const clientIP = getClientIP(req);
      const userIdentifier = getUserIdentifier(req);
      const userRole = req.user?.role as Role;
      const endpoint = req.route?.path || req.path;
      
      // Build list of rate limiters to check
      const limitersToCheck: { limiter: RateLimiterMemory; key: string; type: string }[] = [];
      
      // 1. IP-based rate limiting
      if (!options?.skipIP) {
        const ipConfig = { ...DEFAULT_LIMITS.global, ...config };
        const ipLimiter = createRateLimiter(ipConfig);
        limitersToCheck.push({
          limiter: ipLimiter,
          key: clientIP,
          type: 'ip',
        });
      }
      
      // 2. User-based rate limiting
      if (!options?.skipUser && req.user) {
        const baseConfig = { ...DEFAULT_LIMITS.global, ...config };
        const userLimiter = createRateLimiter({
          ...baseConfig,
          keyPrefix: `${baseConfig.keyPrefix}_user`,
        });
        limitersToCheck.push({
          limiter: userLimiter,
          key: userIdentifier,
          type: 'user',
        });
      }
      
      // 3. Role-based rate limiting
      if (!options?.skipRole && userRole && ROLE_LIMITS[userRole]) {
        const roleLimiter = createRateLimiter(ROLE_LIMITS[userRole]);
        limitersToCheck.push({
          limiter: roleLimiter,
          key: `${userRole}_${userIdentifier}`,
          type: 'role',
        });
      }
      
      // 4. Endpoint-specific rate limiting
      if (!options?.skipEndpoint) {
        const endpointKey = Object.keys(ENDPOINT_LIMITS).find(pattern => 
          endpoint.startsWith(pattern)
        );
        
        if (endpointKey) {
          const endpointLimiter = createRateLimiter(ENDPOINT_LIMITS[endpointKey]);
          limitersToCheck.push({
            limiter: endpointLimiter,
            key: `${endpointKey}_${userIdentifier}`,
            type: 'endpoint',
          });
        }
      }
      
      // 5. Custom rate limiters
      if (options?.customLimits) {
        options.customLimits.forEach((customConfig, index) => {
          const customLimiter = createRateLimiter(customConfig);
          limitersToCheck.push({
            limiter: customLimiter,
            key: `custom_${index}_${userIdentifier}`,
            type: 'custom',
          });
        });
      }
      
      // Check all rate limiters
      const result = await checkRateLimit(req, limitersToCheck);
      
      if (result.blocked) {
        // Log rate limit violation
        console.log(`[RATE_LIMIT] BLOCKED - IP: ${clientIP}, User: ${userIdentifier}, Type: ${result.blockedBy}, Endpoint: ${endpoint}`);
        
        // Set rate limit headers
        if (result.limitInfo) {
          res.set({
            'X-RateLimit-Limit': result.limitInfo.limit.toString(),
            'X-RateLimit-Remaining': result.limitInfo.remaining.toString(),
            'X-RateLimit-Reset': result.limitInfo.reset.toISOString(),
            'Retry-After': result.limitInfo.retryAfter.toString(),
          });
        }
        
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. You have made too many requests. Please try again later.`,
          code: 'RATE_LIMIT_EXCEEDED',
          type: result.blockedBy,
          retryAfter: result.limitInfo?.retryAfter,
          limit: result.limitInfo?.limit,
          remaining: result.limitInfo?.remaining,
        });
      }
      
      // Set rate limit headers for successful requests
      res.set({
        'X-RateLimit-Limit': '1000', // Default limit
        'X-RateLimit-Remaining': '999', // Approximate remaining
      });
      
      return next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Don't block requests if rate limiter fails
      return next();
    }
  };
};

// Specific rate limiters for different endpoints
export const authRateLimit = createRateLimitMiddleware(DEFAULT_LIMITS.auth);
export const loginRateLimit = createRateLimitMiddleware(DEFAULT_LIMITS.login);
export const passwordResetRateLimit = createRateLimitMiddleware(DEFAULT_LIMITS.passwordReset);

// Strict rate limiter for sensitive operations
export const strictRateLimit = createRateLimitMiddleware({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  keyPrefix: 'strict',
});

// Lenient rate limiter for public endpoints
export const lenientRateLimit = createRateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per 15 minutes
  keyPrefix: 'lenient',
});

// Bypass rate limiting for specific IPs (whitelisting)
const WHITELISTED_IPS = new Set([
  '127.0.0.1',
  '::1',
  ...(process.env.WHITELISTED_IPS?.split(',') || []),
]);

export const bypassRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = getClientIP(req);
  if (WHITELISTED_IPS.has(clientIP)) {
    return next();
  }
  return createRateLimitMiddleware()(req as AuthenticatedRequest, res, next);
};

// Rate limiting metrics endpoint
export const getRateLimitMetrics = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== Role.SUPER_ADMIN) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const topBlockedIPs = Array.from(metrics.topBlockedIPs.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const topBlockedUsers = Array.from(metrics.topBlockedUsers.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  return res.json({
    totalRequests: metrics.totalRequests,
    blockedRequests: metrics.blockedRequests,
    blockRate: metrics.totalRequests > 0 ? (metrics.blockedRequests / metrics.totalRequests) * 100 : 0,
    lastResetTime: metrics.lastResetTime,
    topBlockedIPs: topBlockedIPs.map(([ip, count]) => ({ ip, count })),
    topBlockedUsers: topBlockedUsers.map(([user, count]) => ({ user, count })),
    redisConnected: isRedisConnected,
    configurations: {
      defaultLimits: DEFAULT_LIMITS,
      roleLimits: ROLE_LIMITS,
      endpointLimits: ENDPOINT_LIMITS,
    },
  });
};

// Rate limit status for current user
export const getRateLimitStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientIP = getClientIP(req);
    const userIdentifier = getUserIdentifier(req);
    const userRole = req.user?.role as Role;
    
    const status: any = {
      ip: clientIP,
      user: userIdentifier,
      role: userRole,
      limits: {},
    };
    
    // Check current status for each limiter type
    const limiters = [
      { name: 'global', config: DEFAULT_LIMITS.global, key: clientIP },
      { name: 'user', config: DEFAULT_LIMITS.global, key: userIdentifier },
    ];
    
    if (userRole && ROLE_LIMITS[userRole]) {
      limiters.push({
        name: 'role',
        config: ROLE_LIMITS[userRole],
        key: `${userRole}_${userIdentifier}`,
      });
    }
    
    for (const { name, config, key } of limiters) {
      try {
        const limiter = createRateLimiter(config);
        const result = await limiter.get(key);
        
        status.limits[name] = {
          limit: config.max,
          remaining: result ? Math.max(0, config.max - result.consumedPoints) : config.max,
          reset: result ? new Date(Date.now() + result.msBeforeNext) : null,
          windowMs: config.windowMs,
        };
      } catch (error) {
        status.limits[name] = {
          limit: config.max,
          remaining: config.max,
          reset: null,
          windowMs: config.windowMs,
        };
      }
    }
    
    return res.json(status);
  } catch (error) {
    console.error('Error getting rate limit status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Cleanup function for graceful shutdown
export const cleanup = async () => {
  rateLimiterCache.clear();
};

// Health check for rate limiting system
export const rateLimitHealthCheck = async (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    redis: {
      connected: isRedisConnected,
      client: 'not initialized - using in-memory',
    },
    memory: {
      cacheSize: rateLimiterCache.size,
      usage: process.memoryUsage(),
    },
    metrics: {
      totalRequests: metrics.totalRequests,
      blockedRequests: metrics.blockedRequests,
      lastReset: metrics.lastResetTime,
    },
  };
  
  res.json(health);
};

export default createRateLimitMiddleware;
