import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/memberport_db',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    name: process.env.DATABASE_NAME || 'memberport_db',
    user: process.env.DATABASE_USER || 'username',
    password: process.env.DATABASE_PASSWORD || 'password',
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Email Configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || '',
    },
    from: process.env.EMAIL_FROM || 'noreply@memberport.com',
    fromName: process.env.EMAIL_FROM_NAME || 'MemberPort',
  },

  // SMS Configuration
  sms: {
    provider: process.env.SMS_PROVIDER || 'twilio',
    apiKey: process.env.SMS_API_KEY || '',
    apiSecret: process.env.SMS_API_SECRET || '',
    from: process.env.SMS_FROM || '+1234567890',
  },

  // Payment Gateway Configuration
  payments: {
    mpesa: {
      consumerKey: process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
      shortcode: process.env.MPESA_SHORTCODE || '',
      passkey: process.env.MPESA_PASSKEY || '',
      callbackUrl: process.env.MPESA_CALLBACK_URL || '',
    },
  },

  // File Storage Configuration
  fileStorage: {
    provider: process.env.FILE_STORAGE_PROVIDER || 'local',
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET || 'memberport-files',
    },
    minio: {
      endpoint: process.env.MINIO_ENDPOINT || 'localhost:9000',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    },
  },

  // External API Configuration
  externalApis: {
    kra: {
      url: process.env.KRA_API_URL || 'https://kra-api.example.com',
      apiKey: process.env.KRA_API_KEY || '',
    },
    nssf: {
      url: process.env.NSSF_API_URL || 'https://nssf-api.example.com',
      apiKey: process.env.NSSF_API_KEY || '',
    },
    nhif: {
      url: process.env.NHIF_API_URL || 'https://nhif-api.example.com',
      apiKey: process.env.NHIF_API_KEY || '',
    },
  },

  // Encryption Configuration
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key',
    iv: process.env.ENCRYPTION_IV || 'your-16-character-iv',
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: {
      maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
      maxFiles: process.env.LOG_FILE_MAX_FILES || '14d',
    },
  },

  // Monitoring Configuration
  monitoring: {
    enabled: process.env.ENABLE_METRICS === 'true',
    port: parseInt(process.env.METRICS_PORT || '9090', 10),
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
  },

  // Background Jobs Configuration
  jobs: {
    redis: {
      host: process.env.BULL_REDIS_HOST || 'localhost',
      port: parseInt(process.env.BULL_REDIS_PORT || '6379', 10),
      password: process.env.BULL_REDIS_PASSWORD || '',
    },
  },

  // Notification Configuration
  notifications: {
    pushKey: process.env.PUSH_NOTIFICATION_KEY || '',
    websocketEnabled: process.env.WEBSOCKET_ENABLED === 'true',
  },

  // Development Configuration
  development: {
    swaggerEnabled: process.env.SWAGGER_ENABLED === 'true',
    debugMode: process.env.DEBUG_MODE === 'true',
    mockExternalApis: process.env.MOCK_EXTERNAL_APIS === 'true',
  },

  // Swagger Configuration
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    title: 'MemberPort API',
    version: '1.0.0',
    description: 'Backend API for MemberPort - Pension Fund Management System',
  },
};
