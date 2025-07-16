# Role-Based Access Control (RBAC) System

This document explains the comprehensive RBAC system implemented in the Member Port API Gateway.

## Overview

The RBAC system provides:
- **Hierarchical role-based access control**
- **Fine-grained permission management**
- **Organization-scoped access control**
- **Audit logging and monitoring**
- **Dynamic route protection**

## Role Hierarchy

The system defines the following role hierarchy (higher levels inherit permissions from lower levels):

| Role | Level | Description |
|------|-------|-------------|
| `guest` | 0 | Public access, minimal permissions |
| `member` | 1 | Regular organization members |
| `pension-officer` | 2 | Pension officers with member management capabilities |
| `admin` | 3 | Organization administrators |
| `super-admin` | 4 | System-wide administrators |

## Permissions

### User Management
- `create:user` - Create new users
- `read:user` - View user information
- `update:user` - Modify user details
- `delete:user` - Remove users

### Organization Management
- `create:organization` - Create new organizations
- `read:organization` - View organization information
- `update:organization` - Modify organization details
- `delete:organization` - Remove organizations

### Member Management
- `create:member` - Add new members
- `read:member` - View member information
- `update:member` - Modify member details
- `delete:member` - Remove members

### Event Management
- `create:event` - Create new events
- `read:event` - View event information
- `update:event` - Modify event details
- `delete:event` - Remove events

### Payment Management
- `create:payment` - Process payments
- `read:payment` - View payment information
- `update:payment` - Modify payment details
- `delete:payment` - Remove payments

### Analytics
- `read:analytics` - Access analytics data

### Communication
- `create:communication` - Send communications
- `read:communication` - View communications
- `update:communication` - Modify communications
- `delete:communication` - Remove communications

### Notifications
- `create:notification` - Create notifications
- `read:notification` - View notifications
- `update:notification` - Modify notifications
- `delete:notification` - Remove notifications

### Profile Management
- `read:profile` - View user profiles
- `update:profile` - Modify user profiles

## Default Role Permissions

### Guest
- `read:event`
- `read:profile`

### Member
- All guest permissions plus:
- `update:profile`
- `read:notification`
- `read:communication`
- `read:payment`
- `create:payment`

### Pension Officer
- All member permissions plus:
- `read:member`
- `update:member`
- `create:member`
- `read:user`
- `update:user`

### Admin
- All pension officer permissions plus:
- `create:user`
- `delete:user`
- `read:organization`
- `update:organization`
- `delete:member`
- `create:event`
- `update:event`
- `delete:event`
- `update:payment`
- `delete:payment`
- `read:analytics`
- `create:communication`
- `update:communication`
- `delete:communication`
- `create:notification`
- `update:notification`
- `delete:notification`

### Super Admin
- All permissions in the system

## Route Protection

### Service Routes

| Route | Method | Required Role/Permission | Organization Scope |
|-------|---------|-------------------------|-------------------|
| `/api/v1/auth/*` | ALL | Public | No |
| `/api/v1/users` | ALL | `read:user` | Yes |
| `/api/v1/organizations` | ALL | `read:organization` + Admin role | No |
| `/api/v1/notifications` | ALL | `read:notification` | Yes |
| `/api/v1/memberships` | ALL | `read:member` | Yes |
| `/api/v1/events` | ALL | `read:event` | Yes |
| `/api/v1/communications` | ALL | `read:communication` | Yes |
| `/api/v1/payments` | ALL | `read:payment` | Yes |
| `/api/v1/analytics` | ALL | `read:analytics` + Admin role | No |

### RBAC Management Routes

| Route | Method | Required Role | Description |
|-------|---------|---------------|-------------|
| `/api/v1/rbac/audit-logs` | GET | Super Admin | View audit logs |
| `/api/v1/rbac/my-permissions` | GET | Any authenticated | Get current user's permissions |
| `/api/v1/rbac/check-permission` | POST | Any authenticated | Check specific permission |
| `/api/v1/rbac/roles` | GET | Admin | Get role hierarchy information |

## Usage Examples

### Basic Role Check
```typescript
import { rbac, Role } from './middleware/rbac';

// Require admin role
app.use('/admin-only', rbac({ role: [Role.ADMIN] }));
```

### Permission Check
```typescript
import { rbac, Permission } from './middleware/rbac';

// Require specific permission
app.use('/users', rbac({ 
  permission: [Permission.READ_USER],
  organizationScope: true 
}));
```

### Dynamic Resource-Action Check
```typescript
import { requireResourceAction, Resource, Action } from './middleware/rbac';

// Check for read permission on events
app.use('/events', requireResourceAction(Resource.EVENT, Action.READ));
```

### Custom Check
```typescript
import { rbac } from './middleware/rbac';

// Custom business logic check
app.use('/special', rbac({
  role: [Role.MEMBER],
  customCheck: (req) => {
    // Custom logic here
    return req.user.organizationId === 'special-org';
  }
}));
```

## Testing

### Generate Test Tokens
```bash
node test-rbac.js
```

### Export Tokens
```bash
export MEMBER_TOKEN="your-member-token"
export ADMIN_TOKEN="your-admin-token"
export SUPER_ADMIN_TOKEN="your-super-admin-token"
```

### Test Endpoints
```bash
# Test member access to events (should pass)
curl -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/events

# Test member access to organizations (should fail)
curl -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/organizations

# Test admin access to organizations (should pass)
curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:3000/api/v1/organizations

# Get user permissions
curl -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/v1/rbac/my-permissions

# Check specific permission
curl -X POST -H "Authorization: Bearer $MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resource": "event", "action": "read"}' \
  http://localhost:3000/api/v1/rbac/check-permission
```

## Audit Logging

The system automatically logs all access attempts with the following information:
- User ID
- Action attempted
- Resource accessed
- Success/failure status
- Reason for failure (if applicable)
- Organization ID
- IP address
- User agent
- Timestamp

### View Audit Logs
```bash
# Super admin only
curl -H "Authorization: Bearer $SUPER_ADMIN_TOKEN" \
  http://localhost:3000/api/v1/rbac/audit-logs?limit=50&offset=0
```

## Organization Scope

When `organizationScope: true` is set:
- Users can only access resources within their organization
- Super admins can access resources from any organization
- Organization ID is extracted from:
  - Request parameters: `req.params.organizationId`
  - Request body: `req.body.organizationId`
  - Query parameters: `req.query.organizationId`
  - Headers: `req.headers['x-organization-id']`

## Security Considerations

1. **Token Validation**: All tokens are validated for signature, expiration, and issuer
2. **Role Hierarchy**: Higher roles automatically inherit lower role permissions
3. **Organization Isolation**: Users are restricted to their organization's data
4. **Audit Trail**: All access attempts are logged for security monitoring
5. **Permission Granularity**: Fine-grained permissions allow precise access control

## Configuration

### Environment Variables
```env
JWT_SECRET=your-secret-key
JWT_ISSUER=memberport-gateway
JWT_REFRESH_SECRET=your-refresh-secret
```

### Extending Permissions
To add new permissions:
1. Add to the `Permission` enum in `rbac.ts`
2. Update `ROLE_PERMISSIONS` mapping
3. Create resource-specific middleware if needed

### Adding New Roles
To add new roles:
1. Add to the `Role` enum
2. Update `ROLE_HIERARCHY` with appropriate level
3. Define permissions in `ROLE_PERMISSIONS`

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INSUFFICIENT_ROLE` | Role permissions insufficient |
| `INSUFFICIENT_PERMISSIONS` | Specific permissions missing |
| `ORG_ACCESS_DENIED` | Organization access denied |
| `CUSTOM_CHECK_FAILED` | Custom validation failed |
| `TOKEN_EXPIRED` | JWT token expired |
| `INVALID_TOKEN` | Invalid JWT token |
| `VALIDATION_FAILED` | Token validation failed |

## Best Practices

1. **Principle of Least Privilege**: Grant minimum permissions necessary
2. **Regular Auditing**: Review audit logs regularly
3. **Role Assignment**: Assign roles based on job functions
4. **Token Management**: Use short-lived tokens with refresh mechanism
5. **Organization Boundaries**: Ensure proper organization isolation
6. **Permission Checks**: Always check permissions at the gateway level
7. **Monitoring**: Monitor failed access attempts for security threats
