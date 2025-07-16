# MemberPort Backend API

A comprehensive Node.js/Express backend API for the MemberPort pension fund management system.

## Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **Member Management** - Complete CRUD operations for pension fund members
- **Contribution Management** - Track employee/employer contributions and reconciliation
- **Claims Processing** - Handle retirement, medical, and death benefit claims
- **Beneficiary Management** - Manage member beneficiaries
- **Medical Claims** - Process inpatient/outpatient medical claims
- **Voting System** - Handle member voting sessions
- **Admin Dashboard** - Comprehensive admin analytics and management
- **Audit Logging** - Track all system changes
- **File Upload** - Secure document upload functionality
- **Bulk Operations** - Import/export data in bulk

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
src/
├── index.ts              # Application entry point
├── types/                # TypeScript type definitions
├── models/               # Mongoose models
├── routes/               # API route handlers
│   ├── auth.ts          # Authentication routes
│   ├── members.ts       # Member management
│   ├── contributions.ts # Contribution management
│   ├── claims.ts        # Claims processing
│   ├── admin.ts         # Admin operations
│   └── ...
├── middleware/           # Custom middleware
│   ├── auth.ts          # Authentication middleware
│   ├── errorHandler.ts  # Error handling
│   └── notFound.ts      # 404 handler
└── utils/               # Utility functions
    └── logger.ts        # Winston logging setup
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/memberport
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Development server**:
   ```bash
   npm run dev
   ```

5. **Production build**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get current user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `PUT /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/logout` - Logout user

### Members
- `GET /api/v1/members` - Get all members (Admin only)
- `GET /api/v1/members/:id` - Get member by ID
- `POST /api/v1/members` - Create new member (Admin only)
- `PUT /api/v1/members/:id` - Update member (Admin only)
- `DELETE /api/v1/members/:id` - Deactivate member (Admin only)
- `GET /api/v1/members/analytics/stats` - Get member statistics (Admin only)

### Contributions
- `GET /api/v1/contributions` - Get contributions
- `GET /api/v1/contributions/:id` - Get contribution by ID
- `POST /api/v1/contributions` - Create contribution (Admin only)

### Claims
- `GET /api/v1/claims` - Get claims
- `GET /api/v1/claims/:id` - Get claim by ID
- `POST /api/v1/claims` - Submit new claim

### Admin
- `GET /api/v1/admin/dashboard` - Get admin dashboard data
- `GET /api/v1/admin/approvals` - Get pending approvals
- `GET /api/v1/admin/bulk-operations` - Get bulk operations
- `GET /api/v1/admin/alerts` - Get system alerts

### File Upload
- `POST /api/v1/upload/single` - Upload single file
- `POST /api/v1/upload/multiple` - Upload multiple files

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **Member** - Regular pension fund members
- **Admin** - System administrators
- **Pension Officer** - Pension fund officers
- **Finance Officer** - Financial officers
- **Medical Officer** - Medical claim officers
- **Approver** - Approval workflow officers

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (when applicable)
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Data Models

### Member
Core member information including personal details, employment info, and pension settings.

### Contribution
Employee and employer contributions with reconciliation status.

### Claim
Retirement, medical, and death benefit claims processing.

### Beneficiary
Member beneficiaries for death benefits.

### Audit Log
Complete audit trail of all system changes.

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Testing
```bash
npm test
```

### Database Seeding
You can create sample data for development:

```javascript
// Create admin user
POST /api/v1/auth/register
{
  "name": "Admin User",
  "email": "admin@memberport.com",
  "password": "admin123",
  "role": "Admin"
}
```

## Deployment

1. **Environment Variables**: Set all required environment variables
2. **Database**: Ensure MongoDB is accessible
3. **Build**: Run `npm run build`
4. **Start**: Run `npm start`

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- File upload restrictions

## Logging

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

MIT License - see LICENSE file for details
