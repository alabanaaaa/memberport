const jwt = require('jsonwebtoken');

// Configuration (should match your middleware)
const jwtSecret = process.env.JWT_SECRET || 'your-default-secret-key';
const jwtIssuer = process.env.JWT_ISSUER || 'memberport-gateway';

// Test user data
const testUsers = {
  member: {
    id: 'user123',
    email: 'member@example.com',
    role: 'member',
    organizationId: 'org123',
    permissions: ['read:profile', 'write:profile']
  },
  admin: {
    id: 'admin123',
    email: 'admin@example.com',
    role: 'admin',
    organizationId: 'org123',
    permissions: ['read:all', 'write:all', 'delete:all']
  },
  superAdmin: {
    id: 'superadmin123',
    email: 'superadmin@example.com',
    role: 'super-admin',
    organizationId: 'org123',
    permissions: ['*']
  }
};

// Generate tokens
function generateToken(userType) {
  const userData = testUsers[userType];
  if (!userData) {
    throw new Error(`Unknown user type: ${userType}`);
  }

  const token = jwt.sign(
    userData,
    jwtSecret,
    {
      issuer: jwtIssuer,
      expiresIn: '1h'
    }
  );

  return token;
}

// Generate tokens for all user types
const userType = process.argv[2] || 'member';

try {
  const token = generateToken(userType);
  console.log(`${userType.toUpperCase()} TOKEN:`);
  console.log(token);
  console.log('\nUser Data:');
  console.log(JSON.stringify(testUsers[userType], null, 2));
} catch (error) {
  console.error('Error:', error.message);
  console.log('\nUsage: node generate-test-token.js [member|admin|superAdmin]');
}
