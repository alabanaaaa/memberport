# MemberPort Backend API

A comprehensive backend API for the MemberPort pension fund management system built with Node.js, TypeScript, Express, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Member Management**: Complete member lifecycle management
- **Contribution Processing**: Handle pension contributions and reconciliation
- **Claims Management**: Process retirement and benefit claims
- **Medical Administration**: Manage medical claims and coverage
- **Voting System**: Electronic voting for scheme elections
- **Audit Trail**: Comprehensive logging and audit capabilities
- **Real-time Updates**: WebSocket support for real-time notifications
- **File Upload**: Support for document and image uploads
- **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT tokens
- **Validation**: Joi schema validation
- **Logging**: Winston
- **Testing**: Jest
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 13 or higher
- Redis 6 or higher
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd memberport/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run migrate
   
   # Seed database (optional)
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## Docker Setup

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This will start:
- API server on port 3000
- PostgreSQL on port 5432
- Redis on port 6379
- pgAdmin on port 8080
- Redis Commander on port 8081

### Manual Docker Build

```bash
# Build image
docker build -t memberport-backend .

# Run container
docker run -p 3000:3000 memberport-backend
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`

## Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/memberport_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout

### Members
- `GET /api/v1/members` - Get all members (admin)
- `GET /api/v1/members/:id` - Get member by ID
- `PUT /api/v1/members/:id` - Update member
- `GET /api/v1/members/:id/dashboard` - Member dashboard

### Contributions
- `GET /api/v1/contributions` - Get contributions
- `POST /api/v1/contributions` - Create contribution
- `GET /api/v1/contributions/:id` - Get contribution details

### Claims
- `GET /api/v1/claims` - Get claims
- `POST /api/v1/claims` - Submit claim
- `PUT /api/v1/claims/:id` - Update claim status

### And many more...

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User**: Authentication and basic user info
- **Member**: Extended member profile and pension details
- **Contribution**: Monthly pension contributions
- **Claim**: Retirement and benefit claims
- **Beneficiary**: Member beneficiaries
- **MedicalRecord**: Medical claims and coverage
- **VotingEvent**: Electronic voting events
- **AuditLog**: System audit trail

## Development

### Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run migrate      # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Project Structure

```
src/
├── api/                 # API layer
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   └── routes/          # Route definitions
├── business/            # Business logic
├── config/              # Configuration files
├── data/                # Data access layer
├── external/            # External integrations
├── security/            # Security utilities
├── services/            # Core services
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Fine-grained permissions
- **Rate Limiting**: Prevent abuse and DoS attacks
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM protection
- **CORS Configuration**: Cross-origin request handling
- **Helmet.js**: Security headers
- **Password Hashing**: bcrypt for secure password storage

## Monitoring & Logging

- **Winston Logging**: Structured logging with rotation
- **Request Logging**: Morgan middleware for HTTP requests
- **Error Tracking**: Comprehensive error handling
- **Health Checks**: Built-in health check endpoints
- **Performance Monitoring**: Request timing and metrics

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Configure SMTP for emails
5. Set up SSL/TLS termination
6. Configure reverse proxy (nginx)

### Deployment Options

- **Docker**: Use provided Dockerfile and docker-compose.yml
- **PM2**: Process manager for Node.js apps
- **Kubernetes**: Container orchestration
- **Cloud Services**: AWS, Azure, Google Cloud

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
