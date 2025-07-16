const jwt = require('jsonwebtoken');

// JWT configuration
const jwtSecret = process.env.JWT_SECRET || 'your-default-secret-key';
const jwtIssuer = process.env.JWT_ISSUER || 'memberport-gateway';

// Test with different user roles
const testUsers = [
  {
    id: 'user123',
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
console.log('🔑 Generating test tokens for RBAC testing...\n');

testUsers.forEach(user => {
  const token = jwt.sign(user, jwtSecret, {
    expiresIn: '1h',
    issuer: jwtIssuer
  });
  
  console.log(`${user.role.toUpperCase()} Token:`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Organization: ${user.organizationId}`);
  console.log(`Token: ${token}`);
  console.log(`\nTest command:`);
  console.log(`export ${user.role.toUpperCase().replace('-', '_')}_TOKEN="${token}"`);
  console.log('\n---\n');
});

// Test API endpoints
console.log('🧪 Test API endpoints with different roles:\n');

const testEndpoints = [
  {
    endpoint: '/api/v1/organizations',
    method: 'GET',
    description: 'Organization management (Admin only)',
    expectedRoles: ['admin', 'super-admin']
  },
  {
    endpoint: '/api/v1/users',
    method: 'GET',
    description: 'User management (Pension Officer+)',
    expectedRoles: ['pension-officer', 'admin', 'super-admin']
  },
  {
    endpoint: '/api/v1/events',
    method: 'GET',
    description: 'Event access (Member+)',
    expectedRoles: ['member', 'pension-officer', 'admin', 'super-admin']
  },
  {
    endpoint: '/api/v1/payments',
    method: 'GET',
    description: 'Payment access (Member+)',
    expectedRoles: ['member', 'pension-officer', 'admin', 'super-admin']
  },
  {
    endpoint: '/api/v1/analytics',
    method: 'GET',
    description: 'Analytics access (Admin only)',
    expectedRoles: ['admin', 'super-admin']
  },
  {
    endpoint: '/api/v1/rbac/audit-logs',
    method: 'GET',
    description: 'Audit logs (Super Admin only)',
    expectedRoles: ['super-admin']
  },
  {
    endpoint: '/api/v1/rbac/my-permissions',
    method: 'GET',
    description: 'User permissions (All authenticated users)',
    expectedRoles: ['member', 'pension-officer', 'admin', 'super-admin']
  }
];

testEndpoints.forEach(endpoint => {
  console.log(`📍 ${endpoint.method} ${endpoint.endpoint}`);
  console.log(`   Description: ${endpoint.description}`);
  console.log(`   Expected roles: ${endpoint.expectedRoles.join(', ')}`);
  console.log(`   Test commands:`);
  
  testUsers.forEach(user => {
    const shouldPass = endpoint.expectedRoles.includes(user.role);
    const status = shouldPass ? '✅ SHOULD PASS' : '❌ SHOULD FAIL';
    console.log(`   curl -H "Authorization: Bearer $${user.role.toUpperCase().replace('-', '_')}_TOKEN" http://localhost:3000${endpoint.endpoint} # ${status}`);
  });
  
  console.log('\n');
});

console.log('💡 Usage:');
console.log('1. Start the gateway server: npm start');
console.log('2. Run this script to generate tokens: node test-rbac.js');
console.log('3. Export the tokens as environment variables');
console.log('4. Test the endpoints with curl commands shown above');
console.log('5. Check the server logs for RBAC audit messages');
