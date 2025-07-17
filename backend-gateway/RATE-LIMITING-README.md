# Rate Limiting and Throttling System

This document explains the comprehensive rate limiting and throttling system implemented in the Member Port API Gateway.

## Overview

The rate limiting system provides multi-layered protection against abuse and ensures fair resource allocation across users. It includes:

- **Multi-level rate limiting** (IP, User, Token, Role-based)
- **Redis-backed distributed rate limiting** with in-memory fallback
- **Endpoint-specific rate limits** for sensitive operations
- **Role-based rate limits** with hierarchy support
- **Burst protection** and **sliding window** algorithms
- **Comprehensive monitoring** and **metrics**
- **Graceful degradation** when rate limits are exceeded

## Architecture

```
Request Flow:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IP-Based      │    │   User-Based    │    │   Role-Based    │
│  Rate Limiting  │───▶│  Rate Limiting  │───▶│  Rate Limiting  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Custom        │    │   Endpoint      │    │   Continue to   │
│  Rate Limiting  │◀───│  Rate Limiting  │◀───│   Application   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Rate Limiting Levels

### 1. Global IP-Based Rate Limiting

**Default Configuration:**
- **Window**: 15 minutes
- **Max Requests**: 1000 per window
- **Purpose**: Prevent IP-based abuse

**Whitelisting:**
- Localhost (127.0.0.1, ::1) is automatically whitelisted
- Additional IPs can be whitelisted via `WHITELISTED_IPS` environment variable

### 2. Role-Based Rate Limiting

Different roles have different rate limits based on their access level:

| Role | Requests per 15 minutes | Description |
|------|-------------------------|-------------|
| **Guest** | 50 | Basic public access |
| **Member** | 200 | Regular users |
| **Pension Officer** | 500 | Staff with member management capabilities |
| **Admin** | 1000 | Organization administrators |
| **Super Admin** | 5000 | System administrators |

### 3. Endpoint-Specific Rate Limiting

Critical endpoints have additional rate limits:

| Endpoint | Requests per minute | Window |
|----------|-------------------|---------|
| `/api/v1/payments` | 10 | 1 minute |
| `/api/v1/analytics` | 30 | 1 minute |
| `/api/v1/users` | 100 | 1 minute |
| `/api/v1/organizations` | 50 | 1 minute |

### 4. Authentication Rate Limiting

**Login Endpoint:**
- **Window**: 15 minutes
- **Max Requests**: 10 per window
- **Purpose**: Prevent brute force attacks

**Password Reset:**
- **Window**: 1 hour
- **Max Requests**: 5 per window
- **Purpose**: Prevent reset abuse

**General Auth Endpoints:**
- **Window**: 15 minutes
- **Max Requests**: 20 per window
- **Purpose**: Protect authentication services

## Technology Stack

### Primary Backend: Redis
- **Distributed rate limiting** across multiple instances
- **Persistent storage** for rate limit counters
- **High performance** with sub-millisecond latency
- **Automatic failover** to in-memory storage

### Fallback Backend: In-Memory
- **Zero dependencies** when Redis is unavailable
- **Process-local rate limiting**
- **Automatic activation** when Redis connection fails

### Algorithm: Sliding Window
- **Smooth rate limiting** without sudden bursts
- **Even distribution** of requests across time windows
- **Configurable block duration** for violating clients

## Implementation Details

### Rate Limiter Factory

```typescript
createRateLimitMiddleware(config?, options?)
```

**Parameters:**
- `config`: Rate limit configuration (window, max requests, etc.)
- `options`: Middleware options (skip IP, skip user, etc.)

**Example Usage:**
```typescript
// Basic rate limiting
app.use(createRateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  keyPrefix: 'api_limit'
}));

// Skip specific checks
app.use(createRateLimitMiddleware({}, {
  skipIP: false,
  skipUser: false, 
  skipRole: false,
  skipEndpoint: false
}));
```

### Key Generation Strategy

Rate limiting keys are generated based on:

1. **IP Address**: `clientIP` from headers or connection
2. **User ID**: `user_${userId}` for authenticated users
3. **Role**: `${role}_${userIdentifier}` for role-based limits
4. **Endpoint**: `${endpoint}_${userIdentifier}` for endpoint-specific limits
5. **Token**: `token_${tokenPrefix}...` for token-based limits

### Headers and Response Format

**Success Response Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 2023-12-01T12:00:00.000Z
```

**Rate Limit Exceeded Response:**
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. You have made too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "type": "user",
  "retryAfter": 300,
  "limit": 200,
  "remaining": 0
}
```

## API Endpoints

### Rate Limiting Management

#### GET /api/v1/rate-limit/health
**Description**: Check rate limiting system health  
**Authentication**: None required  
**Response**: System health status

```json
{
  "status": "healthy",
  "redis": {
    "connected": true,
    "client": "initialized"
  },
  "memory": {
    "cacheSize": 15,
    "usage": { "rss": 45678, "heapUsed": 12345 }
  },
  "metrics": {
    "totalRequests": 1000,
    "blockedRequests": 25,
    "lastReset": "2023-12-01T00:00:00.000Z"
  }
}
```

#### GET /api/v1/rate-limit/status
**Description**: Get current user's rate limit status  
**Authentication**: Required  
**Response**: Current rate limit status

```json
{
  "ip": "192.168.1.100",
  "user": "user_123",
  "role": "member",
  "limits": {
    "global": {
      "limit": 1000,
      "remaining": 995,
      "reset": "2023-12-01T12:15:00.000Z",
      "windowMs": 900000
    },
    "role": {
      "limit": 200,
      "remaining": 180,
      "reset": "2023-12-01T12:15:00.000Z",
      "windowMs": 900000
    }
  }
}
```

#### GET /api/v1/rate-limit/metrics
**Description**: Get comprehensive rate limiting metrics  
**Authentication**: Super Admin only  
**Response**: Detailed metrics and statistics

```json
{
  "totalRequests": 10000,
  "blockedRequests": 150,
  "blockRate": 1.5,
  "lastResetTime": "2023-12-01T00:00:00.000Z",
  "topBlockedIPs": [
    { "ip": "192.168.1.100", "count": 25 },
    { "ip": "10.0.0.1", "count": 15 }
  ],
  "topBlockedUsers": [
    { "user": "user_123", "count": 10 },
    { "user": "user_456", "count": 8 }
  ],
  "redisConnected": true,
  "configurations": {
    "defaultLimits": { ... },
    "roleLimits": { ... },
    "endpointLimits": { ... }
  }
}
```

## Configuration

### Environment Variables

```bash
# Redis Configuration
REDIS_URL=redis://localhost:6379

# Rate Limiting Configuration
WHITELISTED_IPS=127.0.0.1,::1,10.0.0.1

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_ISSUER=memberport-gateway
```

### Custom Rate Limits

```typescript
// Custom rate limiter for specific endpoints
const customRateLimit = createRateLimitMiddleware({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 requests per window
  keyPrefix: 'custom_api'
});

app.use('/api/v1/custom', customRateLimit);
```

### Endpoint-Specific Configuration

```typescript
// Payment endpoints with strict limits
app.use('/api/v1/payments', createRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  keyPrefix: 'payments'
}));
```

## Monitoring and Alerting

### Console Logging

The system provides detailed console logging:

```
[RATE_LIMIT] BLOCKED - IP: 192.168.1.100, User: user_123, Type: role, Endpoint: /api/v1/payments
[RATE_LIMIT] ALLOWED - IP: 192.168.1.100, User: user_123, Type: ip, Endpoint: /api/v1/events
```

### Metrics Collection

Metrics are automatically collected and include:
- **Total requests** processed
- **Blocked requests** count
- **Block rate** percentage
- **Top blocked IPs** and users
- **System health** status

### Daily Metric Resets

Metrics are automatically reset every 24 hours to prevent memory growth.

## Testing

### Generate Test Tokens

```bash
node test-rate-limiting.js
```

### Basic Rate Limiting Test

```bash
# Export test tokens
export MEMBER_TOKEN="your-member-token"
export ADMIN_TOKEN="your-admin-token"

# Test rate limiting
for i in {1..10}; do
  curl -s -w "Request $i: %{http_code}\n" \
    -H "Authorization: Bearer $MEMBER_TOKEN" \
    http://localhost:3000/api/v1/rbac/my-permissions
done
```

### Test Endpoint-Specific Limits

```bash
# Test payment endpoint limits (should hit 429 after 10 requests)
for i in {1..15}; do
  curl -s -w "Request $i: %{http_code}\n" \
    -H "Authorization: Bearer $MEMBER_TOKEN" \
    http://localhost:3000/api/v1/payments
  sleep 6 # Wait 6 seconds between requests
done
```

### Test Authentication Limits

```bash
# Test login rate limiting (should hit 429 after 10 attempts)
for i in {1..15}; do
  curl -s -w "Request $i: %{http_code}\n" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}' \
    http://localhost:3000/api/v1/auth/login
done
```

## Redis Setup

### Installation

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install redis-server
```

**macOS:**
```bash
brew install redis
```

**Docker:**
```bash
docker run -d -p 6379:6379 redis:alpine
```

### Configuration

**Start Redis:**
```bash
sudo systemctl start redis
sudo systemctl enable redis
```

**Test Redis:**
```bash
redis-cli ping
# Should return: PONG
```

**Redis URL Configuration:**
```bash
# Local Redis
REDIS_URL=redis://localhost:6379

# Redis with authentication
REDIS_URL=redis://username:password@localhost:6379

# Redis Cluster
REDIS_URL=redis://node1:6379,node2:6379,node3:6379
```

## Performance Considerations

### Memory Usage

- **Redis**: ~1MB per 100,000 rate limit entries
- **In-Memory**: ~500KB per 100,000 rate limit entries
- **Automatic cleanup**: Expired entries are automatically removed

### Latency

- **Redis**: <1ms for rate limit checks
- **In-Memory**: <0.1ms for rate limit checks
- **Network overhead**: Minimal with connection pooling

### Scalability

- **Horizontal scaling**: Redis enables distributed rate limiting
- **Failover**: Automatic fallback to in-memory storage
- **Load balancing**: Consistent rate limiting across instances

## Error Handling

### Redis Connection Issues

```typescript
// Automatic fallback to in-memory storage
try {
  await redisClient.connect();
} catch (error) {
  console.error('Redis connection failed, falling back to in-memory storage');
  // System continues with in-memory rate limiting
}
```

### Rate Limit Middleware Errors

```typescript
// Non-blocking error handling
try {
  await rateLimiter.consume(key);
} catch (error) {
  console.error('Rate limiting error:', error);
  // Request continues without rate limiting
  return next();
}
```

## Security Considerations

### IP Spoofing Protection

The system extracts client IP from multiple sources:
1. `X-Forwarded-For` header (first IP)
2. `X-Real-IP` header
3. Connection remote address
4. Socket remote address

### Token-Based Rate Limiting

- **Token prefix**: Only first 10 characters used for privacy
- **User identification**: Preference given to authenticated user ID
- **Fallback**: IP-based limiting for anonymous users

### Rate Limit Bypass Prevention

- **No bypass mechanisms** for regular users
- **Whitelisting**: Only for trusted IPs via environment variables
- **Role-based limits**: Cannot be bypassed by changing roles

## Troubleshooting

### Common Issues

**1. Redis Connection Failed**
```
Solution: Check Redis server status and connection string
Command: redis-cli ping
```

**2. Rate Limits Too Restrictive**
```
Solution: Adjust limits in rateLimiter.ts configuration
Location: DEFAULT_LIMITS, ROLE_LIMITS, ENDPOINT_LIMITS
```

**3. Memory Usage High**
```
Solution: Enable Redis for distributed storage
Command: Check /api/v1/rate-limit/health endpoint
```

**4. Rate Limiting Not Working**
```
Solution: Check middleware order and configuration
Location: src/index.ts middleware setup
```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=rate-limiter:* npm start
```

### Health Checks

Monitor system health:
```bash
curl http://localhost:3000/api/v1/rate-limit/health
```

## Best Practices

1. **Monitor Metrics**: Regularly check rate limiting metrics
2. **Adjust Limits**: Fine-tune limits based on usage patterns
3. **Use Redis**: Enable Redis for production deployments
4. **Test Thoroughly**: Test rate limiting under load
5. **Plan for Failures**: Ensure graceful degradation
6. **Document Changes**: Keep rate limit configurations documented
7. **Alert on Abuse**: Set up alerting for excessive rate limiting

## Future Enhancements

### Planned Features

1. **Dynamic Rate Limits**: Adjust limits based on system load
2. **Geographic Rate Limiting**: Different limits by region
3. **API Key Rate Limiting**: Per-API-key rate limiting
4. **Machine Learning**: Intelligent abuse detection
5. **Dashboard**: Web-based rate limiting dashboard
6. **Advanced Analytics**: More detailed usage analytics

### Integration Opportunities

1. **Prometheus**: Export metrics to Prometheus
2. **Grafana**: Create monitoring dashboards
3. **Elasticsearch**: Log rate limiting events
4. **Webhooks**: Notifications for rate limit violations
5. **LDAP/AD**: Integration with enterprise directories
