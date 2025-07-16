import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './jwt';

// Role hierarchy definition
export enum Role {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  PENSION_OFFICER = 'pension-officer',
  MEMBER = 'member',
  GUEST = 'guest'
}

// Permission definitions
export enum Permission {
  // User management
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  
  // Organization management
  CREATE_ORGANIZATION = 'create:organization',
  READ_ORGANIZATION = 'read:organization',
  UPDATE_ORGANIZATION = 'update:organization',
  DELETE_ORGANIZATION = 'delete:organization',
  
  // Member management
  CREATE_MEMBER = 'create:member',
  READ_MEMBER = 'read:member',
  UPDATE_MEMBER = 'update:member',
  DELETE_MEMBER = 'delete:member',
  
  // Event management
  CREATE_EVENT = 'create:event',
  READ_EVENT = 'read:event',
  UPDATE_EVENT = 'update:event',
  DELETE_EVENT = 'delete:event',
  
  // Payment management
  CREATE_PAYMENT = 'create:payment',
  READ_PAYMENT = 'read:payment',
  UPDATE_PAYMENT = 'update:payment',
  DELETE_PAYMENT = 'delete:payment',
  
  // Analytics
  READ_ANALYTICS = 'read:analytics',
  
  // Communication
  CREATE_COMMUNICATION = 'create:communication',
  READ_COMMUNICATION = 'read:communication',
  UPDATE_COMMUNICATION = 'update:communication',
  DELETE_COMMUNICATION = 'delete:communication',
  
  // Notifications
  CREATE_NOTIFICATION = 'create:notification',
  READ_NOTIFICATION = 'read:notification',
  UPDATE_NOTIFICATION = 'update:notification',
  DELETE_NOTIFICATION = 'delete:notification',
  
  // Profile management
  READ_PROFILE = 'read:profile',
  UPDATE_PROFILE = 'update:profile'
}

// Resource types
export enum Resource {
  USER = 'user',
  ORGANIZATION = 'organization',
  MEMBER = 'member',
  EVENT = 'event',
  PAYMENT = 'payment',
  ANALYTICS = 'analytics',
  COMMUNICATION = 'communication',
  NOTIFICATION = 'notification',
  PROFILE = 'profile'
}

// Action types
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

// Role hierarchy levels (higher number = more permissions)
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.GUEST]: 0,
  [Role.MEMBER]: 1,
  [Role.PENSION_OFFICER]: 2,
  [Role.ADMIN]: 3,
  [Role.SUPER_ADMIN]: 4
};

// Default permissions for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.GUEST]: [
    Permission.READ_EVENT,
    Permission.READ_PROFILE
  ],
  [Role.MEMBER]: [
    Permission.READ_EVENT,
    Permission.READ_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.READ_NOTIFICATION,
    Permission.READ_COMMUNICATION,
    Permission.READ_PAYMENT,
    Permission.CREATE_PAYMENT
  ],
  [Role.PENSION_OFFICER]: [
    Permission.READ_EVENT,
    Permission.READ_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.READ_NOTIFICATION,
    Permission.READ_COMMUNICATION,
    Permission.READ_PAYMENT,
    Permission.CREATE_PAYMENT,
    Permission.READ_MEMBER,
    Permission.UPDATE_MEMBER,
    Permission.CREATE_MEMBER,
    Permission.READ_USER,
    Permission.UPDATE_USER
  ],
  [Role.ADMIN]: [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.READ_ORGANIZATION,
    Permission.UPDATE_ORGANIZATION,
    Permission.CREATE_MEMBER,
    Permission.READ_MEMBER,
    Permission.UPDATE_MEMBER,
    Permission.DELETE_MEMBER,
    Permission.CREATE_EVENT,
    Permission.READ_EVENT,
    Permission.UPDATE_EVENT,
    Permission.DELETE_EVENT,
    Permission.CREATE_PAYMENT,
    Permission.READ_PAYMENT,
    Permission.UPDATE_PAYMENT,
    Permission.DELETE_PAYMENT,
    Permission.READ_ANALYTICS,
    Permission.CREATE_COMMUNICATION,
    Permission.READ_COMMUNICATION,
    Permission.UPDATE_COMMUNICATION,
    Permission.DELETE_COMMUNICATION,
    Permission.CREATE_NOTIFICATION,
    Permission.READ_NOTIFICATION,
    Permission.UPDATE_NOTIFICATION,
    Permission.DELETE_NOTIFICATION,
    Permission.READ_PROFILE,
    Permission.UPDATE_PROFILE
  ],
  [Role.SUPER_ADMIN]: Object.values(Permission)
};

// Interface for access control check
interface AccessControlCheck {
  role?: Role[];
  permission?: Permission[];
  resource?: Resource;
  action?: Action;
  organizationScope?: boolean;
  customCheck?: (req: AuthenticatedRequest) => boolean;
}

// Audit logging interface
interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  success: boolean;
  reason?: string;
  organizationId?: string;
  ip?: string;
  userAgent?: string;
}

// Simple in-memory audit store (in production, use a proper database)
const auditLogs: AuditLog[] = [];

// Audit logging function
const logAccess = (req: AuthenticatedRequest, action: string, resource: string, success: boolean, reason?: string) => {
  const log: AuditLog = {
    userId: req.user?.id || 'unknown',
    action,
    resource,
    timestamp: new Date(),
    success,
    reason,
    organizationId: req.user?.organizationId,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  };
  
  auditLogs.push(log);
  
  // Log to console (in production, use proper logging service)
  console.log(`[RBAC] ${success ? 'ALLOWED' : 'DENIED'} - User: ${log.userId}, Action: ${action}, Resource: ${resource}${reason ? `, Reason: ${reason}` : ''}`);
};

// Check if user has role
const hasRole = (userRole: string, requiredRoles: Role[]): boolean => {
  const userRoleEnum = userRole as Role;
  return requiredRoles.some(role => 
    ROLE_HIERARCHY[userRoleEnum] >= ROLE_HIERARCHY[role]
  );
};

// Check if user has permission
const hasPermission = (userPermissions: string[], userRole: string, requiredPermissions: Permission[]): boolean => {
  const userRoleEnum = userRole as Role;
  const rolePermissions = ROLE_PERMISSIONS[userRoleEnum] || [];
  const allUserPermissions = [...userPermissions, ...rolePermissions.map(p => p.toString())];
  
  return requiredPermissions.every(permission => 
    allUserPermissions.includes(permission.toString())
  );
};

// Check if user has access to organization
const hasOrganizationAccess = (req: AuthenticatedRequest, organizationId?: string): boolean => {
  if (!req.user) return false;
  
  // Super admins can access any organization
  if (req.user.role === Role.SUPER_ADMIN) return true;
  
  // If no specific organization required, allow access
  if (!organizationId) return true;
  
  // Check if user belongs to the organization
  return req.user.organizationId === organizationId;
};

// Extract organization ID from request
const extractOrganizationId = (req: AuthenticatedRequest): string | undefined => {
  return req.params.organizationId || 
         req.body.organizationId || 
         req.query.organizationId as string ||
         req.headers['x-organization-id'] as string;
};

// Main RBAC middleware factory
export const rbac = (options: AccessControlCheck) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const resource = options.resource || Resource.USER;
    const action = options.action || Action.READ;
    const auditResource = `${resource}:${action}`;
    
    // Check if user is authenticated
    if (!req.user) {
      logAccess(req, action, resource, false, 'User not authenticated');
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    // Custom check first
    if (options.customCheck && !options.customCheck(req)) {
      logAccess(req, action, resource, false, 'Custom check failed');
      return res.status(403).json({
        error: 'Access denied',
        code: 'CUSTOM_CHECK_FAILED'
      });
    }
    
    // Role-based check
    if (options.role && !hasRole(req.user.role, options.role)) {
      logAccess(req, action, resource, false, `Role check failed. Required: ${options.role.join(', ')}, Current: ${req.user.role}`);
      return res.status(403).json({
        error: 'Insufficient role permissions',
        code: 'INSUFFICIENT_ROLE',
        required: options.role,
        current: req.user.role
      });
    }
    
    // Permission-based check
    if (options.permission && !hasPermission(req.user.permissions || [], req.user.role, options.permission)) {
      logAccess(req, action, resource, false, `Permission check failed. Required: ${options.permission.join(', ')}`);
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: options.permission,
        current: req.user.permissions || []
      });
    }
    
    // Organization scope check
    if (options.organizationScope) {
      const orgId = extractOrganizationId(req);
      if (!hasOrganizationAccess(req, orgId)) {
        logAccess(req, action, resource, false, 'Organization access denied');
        return res.status(403).json({
          error: 'Access denied. Organization mismatch',
          code: 'ORG_ACCESS_DENIED'
        });
      }
    }
    
    // All checks passed
    logAccess(req, action, resource, true);
    return next();
  };
};

// Convenience middleware functions
export const requireSuperAdmin = rbac({ role: [Role.SUPER_ADMIN] });
export const requireAdmin = rbac({ role: [Role.ADMIN] });
export const requirePensionOfficer = rbac({ role: [Role.PENSION_OFFICER] });
export const requireMember = rbac({ role: [Role.MEMBER] });

// Resource-specific middleware
export const requireUserManagement = rbac({
  permission: [Permission.READ_USER],
  organizationScope: true
});

export const requireOrganizationManagement = rbac({
  permission: [Permission.READ_ORGANIZATION],
  role: [Role.ADMIN]
});

export const requireAnalyticsAccess = rbac({
  permission: [Permission.READ_ANALYTICS],
  role: [Role.ADMIN]
});

export const requireEventManagement = rbac({
  permission: [Permission.CREATE_EVENT, Permission.UPDATE_EVENT, Permission.DELETE_EVENT],
  organizationScope: true
});

export const requirePaymentAccess = rbac({
  permission: [Permission.READ_PAYMENT],
  organizationScope: true
});

// Dynamic resource-action middleware
export const requireResourceAction = (resource: Resource, action: Action, organizationScope: boolean = true) => {
  const permission = `${action}:${resource}` as Permission;
  return rbac({
    permission: [permission],
    organizationScope
  });
};

// Audit log retrieval (for admin dashboards)
export const getAuditLogs = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== Role.SUPER_ADMIN) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const { limit = 100, offset = 0 } = req.query;
  const logs = auditLogs
    .slice(Number(offset), Number(offset) + Number(limit))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return res.json({
    logs,
    total: auditLogs.length,
    limit: Number(limit),
    offset: Number(offset)
  });
};

// Role hierarchy check helper
export const isRoleHigherThan = (userRole: string, targetRole: Role): boolean => {
  const userRoleEnum = userRole as Role;
  return ROLE_HIERARCHY[userRoleEnum] > ROLE_HIERARCHY[targetRole];
};

// Get user permissions helper
export const getUserPermissions = (role: string, customPermissions: string[] = []): string[] => {
  const roleEnum = role as Role;
  const rolePermissions = ROLE_PERMISSIONS[roleEnum] || [];
  return [...customPermissions, ...rolePermissions.map(p => p.toString())];
};

export default rbac;
