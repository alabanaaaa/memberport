const jwt = require('jsonwebtoken');

// JWT configuration
const jwtSecret = process.env.JWT_SECRET || 'your-default-secret-key';
const jwtIssuer = process.env.JWT_ISSUER || 'memberport-gateway';

// Test users with different roles
const testUsers = [
  {
    id: 'guest123',
    email: 'guest@example.com',
    role: 'guest',
    organizationId: 'org123',
    permissions: []
  },
  {
    id: 'member123',
    email: 'member@example.com',
    role: 'member',
    organizationId: 'org123',
    permissions: ['read:profile', 'write:profile']
  },
  {
    id: 'admin123',
    email: 'admin@example.com',
    role: 'admin',
    organizationId: 'org123',
    permissions: ['read:organization', 'write:organization']
  },
  {
    id: 'superadmin123',
    email: 'superadmin@example.com',
    role: 'super-admin',
    organizationId: 'org123',
    permissions: []
  }
];

// Generate test tokens
console.log('🚀 Rate Limiting Test Suite\n');
console.log('='.repeat(50));

const tokens = {};
testUsers.forEach(user => {
  const token = jwt.sign(user, jwtSecret, {
    expiresIn: '1h',
    issuer: jwtIssuer
  });
  
  tokens[user.role] = token;
  
  console.log(`\n${user.role.toUpperCase()} Token:`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Export command: export ${user.role.toUpperCase().replace('-', '_')}_TOKEN="${token}"`);
});

console.log('\n' + '='.repeat(50));

// Test scenarios
const testScenarios = [
  {
    name: 'Rate Limit Health Check',
    description: 'Check rate limiting system health',
    tests: [
      {
        name: 'Health Check',
        command: 'curl -s http://localhost:3000/api/v1/rate-limit/health',
        expectedStatus: 200
      }
    ]
  },
  {
    name: 'Rate Limit Status Tests',
    description: 'Check rate limit status for different users',
    tests: [
      {
        name: 'Guest Rate Limit Status',
        command: 'curl -s -H "Authorization: Bearer $GUEST_TOKEN" http://localhost:3000/api/v1/rate-limit/status',
        expectedStatus: 200
      },
      {
        name: 'Member Rate Limit Status',
        command: 'curl -s -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/rate-limit/status',
        expectedStatus: 200
      },
      {
        name: 'Admin Rate Limit Status',
        command: 'curl -s -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:3000/api/v1/rate-limit/status',
        expectedStatus: 200
      }
    ]
  },
  {
    name: 'Role-Based Rate Limiting',
    description: 'Test different rate limits for different roles',
    tests: [
      {
        name: 'Guest - Basic endpoint access',
        command: 'for i in {1..5}; do curl -s -w "Request $i: %{http_code}\\n" -H "Authorization: Bearer $GUEST_TOKEN" http://localhost:3000/api/v1/rbac/my-permissions > /dev/null; done',
        expectedStatus: 200
      },
      {
        name: 'Member - Higher rate limit',
        command: 'for i in {1..10}; do curl -s -w "Request $i: %{http_code}\\n" -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/rbac/my-permissions > /dev/null; done',
        expectedStatus: 200
      },
      {
        name: 'Admin - Even higher rate limit',
        command: 'for i in {1..20}; do curl -s -w "Request $i: %{http_code}\\n" -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:3000/api/v1/rbac/my-permissions > /dev/null; done',
        expectedStatus: 200
      }
    ]
  },
  {
    name: 'Endpoint-Specific Rate Limiting',
    description: 'Test specific rate limits for different endpoints',
    tests: [
      {
        name: 'Payment endpoint - Limited to 10 requests per minute',
        command: 'for i in {1..12}; do curl -s -w "Request $i: %{http_code}\\n" -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/payments > /dev/null; sleep 1; done',
        expectedStatus: '200 then 429'
      },
      {
        name: 'Analytics endpoint - Limited to 30 requests per minute',
        command: 'for i in {1..35}; do curl -s -w "Request $i: %{http_code}\\n" -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:3000/api/v1/analytics > /dev/null; sleep 1; done',
        expectedStatus: '200 then 429'
      }
    ]
  },
  {
    name: 'Authentication Rate Limiting',
    description: 'Test stricter limits on authentication endpoints',
    tests: [
      {
        name: 'Login endpoint - Limited to 10 requests per 15 minutes',
        command: 'for i in {1..15}; do curl -s -w "Request $i: %{http_code}\\n" -X POST -H "Content-Type: application/json" -d \'{"email":"test@example.com","password":"test123"}\' http://localhost:3000/api/v1/auth/login > /dev/null; done',
        expectedStatus: '503 then 429'
      },
      {
        name: 'Password reset - Limited to 5 requests per hour',
        command: 'for i in {1..8}; do curl -s -w "Request $i: %{http_code}\\n" -X POST -H "Content-Type: application/json" -d \'{"email":"test@example.com"}\' http://localhost:3000/api/v1/auth/forgot-password > /dev/null; done',
        expectedStatus: '503 then 429'
      }
    ]
  },
  {
    name: 'IP-Based Rate Limiting',
    description: 'Test IP-based rate limiting',
    tests: [
      {
        name: 'Multiple requests from same IP',
        command: 'for i in {1..20}; do curl -s -w "Request $i: %{http_code}\\n" http://localhost:3000/health > /dev/null; done',
        expectedStatus: '200 (should not hit IP limit quickly)'
      }
    ]
  },
  {
    name: 'Rate Limiting Metrics',
    description: 'Test rate limiting metrics and monitoring',
    tests: [
      {
        name: 'Super Admin - View Rate Limiting Metrics',
        command: 'curl -s -H "Authorization: Bearer $SUPER_ADMIN_TOKEN" http://localhost:3000/api/v1/rate-limit/metrics',
        expectedStatus: 200
      },
      {
        name: 'Regular User - Denied Access to Metrics',
        command: 'curl -s -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/rate-limit/metrics',
        expectedStatus: 403
      }
    ]
  },
  {
    name: 'Rate Limit Headers',
    description: 'Test rate limit headers in responses',
    tests: [
      {
        name: 'Check Rate Limit Headers',
        command: 'curl -s -I -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/rbac/my-permissions',
        expectedStatus: 200
      }
    ]
  },
  {
    name: 'Burst Protection',
    description: 'Test burst protection and recovery',
    tests: [
      {
        name: 'Rapid burst requests',
        command: 'for i in {1..50}; do curl -s -w "Request $i: %{http_code}\\n" -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/rbac/my-permissions > /dev/null & done; wait',
        expectedStatus: 'Mixed 200 and 429'
      }
    ]
  }
];

// Display test scenarios
console.log('🧪 Test Scenarios:');
console.log('');

testScenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. ${scenario.name}`);
  console.log(`   Description: ${scenario.description}`);
  console.log('   Tests:');
  
  scenario.tests.forEach((test, testIndex) => {
    console.log(`   ${testIndex + 1}. ${test.name}`);
    console.log(`      Command: ${test.command}`);
    console.log(`      Expected: ${test.expectedStatus}`);
    console.log('');
  });
});

// Rate limiting configuration summary
console.log('⚙️  Rate Limiting Configuration:');
console.log('');

const rateLimitConfig = {
  'Global IP Limits': {
    'Window': '15 minutes',
    'Max Requests': '1000',
    'Description': 'Global IP-based rate limiting'
  },
  'Role-Based Limits': {
    'Guest': '50 requests / 15 minutes',
    'Member': '200 requests / 15 minutes',
    'Pension Officer': '500 requests / 15 minutes',
    'Admin': '1000 requests / 15 minutes',
    'Super Admin': '5000 requests / 15 minutes'
  },
  'Authentication Limits': {
    'Login': '10 requests / 15 minutes',
    'Password Reset': '5 requests / 1 hour',
    'General Auth': '20 requests / 15 minutes'
  },
  'Endpoint-Specific Limits': {
    'Payments': '10 requests / 1 minute',
    'Analytics': '30 requests / 1 minute',
    'Users': '100 requests / 1 minute',
    'Organizations': '50 requests / 1 minute'
  }
};

Object.entries(rateLimitConfig).forEach(([category, config]) => {
  console.log(`${category}:`);
  if (typeof config === 'object') {
    Object.entries(config).forEach(([key, value]) => {
      console.log(`  • ${key}: ${value}`);
    });
  } else {
    console.log(`  • ${config}`);
  }
  console.log('');
});

// Usage instructions
console.log('💡 Usage Instructions:');
console.log('');
console.log('1. Start the API Gateway:');
console.log('   npm start');
console.log('');
console.log('2. Export the test tokens:');
testUsers.forEach(user => {
  console.log(`   export ${user.role.toUpperCase().replace('-', '_')}_TOKEN="${tokens[user.role]}"`);
});
console.log('');
console.log('3. Run individual tests or use the commands above');
console.log('');
console.log('4. Monitor rate limiting logs in the server console');
console.log('');
console.log('5. Check rate limiting metrics:');
console.log('   curl -H "Authorization: Bearer $SUPER_ADMIN_TOKEN" http://localhost:3000/api/v1/rate-limit/metrics');
console.log('');
console.log('6. Check your current rate limit status:');
console.log('   curl -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/rate-limit/status');
console.log('');

// Environment variables
console.log('🔧 Environment Variables:');
console.log('');
console.log('Optional environment variables for configuration:');
console.log('• REDIS_URL - Redis connection URL (default: redis://localhost:6379)');
console.log('• WHITELISTED_IPS - Comma-separated list of whitelisted IPs');
console.log('• JWT_SECRET - JWT secret for token validation');
console.log('• JWT_ISSUER - JWT issuer for token validation');
console.log('');

// Redis setup instructions
console.log('📦 Redis Setup (Optional):');
console.log('');
console.log('For distributed rate limiting with Redis:');
console.log('1. Install Redis: sudo apt-get install redis-server (Ubuntu/Debian)');
console.log('2. Start Redis: sudo systemctl start redis');
console.log('3. Test Redis: redis-cli ping');
console.log('4. Set REDIS_URL environment variable if needed');
console.log('');
console.log('Note: The system will fall back to in-memory rate limiting if Redis is not available.');
