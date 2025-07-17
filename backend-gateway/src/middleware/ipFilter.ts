import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './jwt';

// IP configuration interface
interface IPConfig {
  whitelist: string[];
  blacklist: string[];
  enabled: boolean;
  adminBypass: boolean; // Allow admins to bypass IP restrictions
  superAdminBypass: boolean; // Allow super admins to bypass IP restrictions
}

// Default configuration
const defaultConfig: IPConfig = {
  whitelist: [],
  blacklist: [],
  enabled: process.env.IP_FILTER_ENABLED === 'true' || false,
  adminBypass: process.env.IP_FILTER_ADMIN_BYPASS === 'true' || true,
  superAdminBypass: process.env.IP_FILTER_SUPER_ADMIN_BYPASS === 'true' || true
};

// Global IP configuration
let ipConfig: IPConfig = { ...defaultConfig };

// Environment-based configuration
if (process.env.IP_WHITELIST) {
  ipConfig.whitelist = process.env.IP_WHITELIST.split(',').map(ip => ip.trim());
}

if (process.env.IP_BLACKLIST) {
  ipConfig.blacklist = process.env.IP_BLACKLIST.split(',').map(ip => ip.trim());
}

// Helper function to get real IP address
const getRealIP = (req: Request): string => {
  // Check for forwarded headers first (for load balancers/proxies)
  const xForwardedFor = req.headers['x-forwarded-for'] as string;
  const xRealIP = req.headers['x-real-ip'] as string;
  
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (xRealIP) {
    return xRealIP;
  }
  
  // Fallback to connection remote address
  return req.connection.remoteAddress || req.socket.remoteAddress || req.ip || 'unknown';
};

// Helper function to check if IP matches pattern
const matchesIPPattern = (ip: string, pattern: string): boolean => {
  // Direct match
  if (ip === pattern) {
    return true;
  }
  
  // CIDR notation support (basic implementation)
  if (pattern.includes('/')) {
    const [baseIP, prefixLength] = pattern.split('/');
    const prefix = parseInt(prefixLength, 10);
    
    // Convert IP to number for comparison
    const ipToNumber = (ipAddr: string): number => {
      return ipAddr.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
    };
    
    try {
      const ipNum = ipToNumber(ip);
      const baseNum = ipToNumber(baseIP);
      const mask = (-1 << (32 - prefix)) >>> 0;
      
      return (ipNum & mask) === (baseNum & mask);
    } catch (error) {
      console.error('Error matching CIDR pattern:', error);
      return false;
    }
  }
  
  // Wildcard support (* for any octet)
  if (pattern.includes('*')) {
    const patternParts = pattern.split('.');
    const ipParts = ip.split('.');
    
    if (patternParts.length !== ipParts.length) {
      return false;
    }
    
    return patternParts.every((part, index) => {
      return part === '*' || part === ipParts[index];
    });
  }
  
  return false;
};

// Helper function to check if IP is in list
const isIPInList = (ip: string, list: string[]): boolean => {
  return list.some(pattern => matchesIPPattern(ip, pattern));
};

// Helper function to check if user can bypass IP restrictions
const canBypassIPRestrictions = (req: AuthenticatedRequest): boolean => {
  if (!req.user) {
    return false;
  }
  
  const userRole = req.user.role;
  
  // Super admin bypass
  if (ipConfig.superAdminBypass && userRole === 'super-admin') {
    return true;
  }
  
  // Admin bypass
  if (ipConfig.adminBypass && (userRole === 'admin' || userRole === 'super-admin')) {
    return true;
  }
  
  return false;
};

// Main IP filtering middleware
export const ipFilterMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Skip if IP filtering is disabled
  if (!ipConfig.enabled) {
    return next();
  }
  
  const clientIP = getRealIP(req);
  
  // Log IP for debugging
  console.log(`IP Filter: Client IP ${clientIP} accessing ${req.method} ${req.path}`);
  
  // Check if user can bypass IP restrictions
  if (canBypassIPRestrictions(req)) {
    console.log(`IP Filter: User ${req.user?.email} (${req.user?.role}) bypassing IP restrictions`);
    return next();
  }
  
  // Check blacklist first
  if (ipConfig.blacklist.length > 0 && isIPInList(clientIP, ipConfig.blacklist)) {
    console.warn(`IP Filter: Blocked blacklisted IP ${clientIP}`);
    return res.status(403).json({
      error: 'Access denied',
      code: 'IP_BLACKLISTED',
      message: 'Your IP address has been blocked'
    });
  }
  
  // Check whitelist (if configured)
  if (ipConfig.whitelist.length > 0 && !isIPInList(clientIP, ipConfig.whitelist)) {
    console.warn(`IP Filter: Blocked non-whitelisted IP ${clientIP}`);
    return res.status(403).json({
      error: 'Access denied',
      code: 'IP_NOT_WHITELISTED',
      message: 'Your IP address is not allowed to access this service'
    });
  }
  
  // IP passed all checks
  next();
};

// Stricter IP filtering for sensitive endpoints
export const strictIPFilterMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Always enforce IP filtering for strict endpoints, regardless of global setting
  const clientIP = getRealIP(req);
  
  // Only super admins can bypass strict IP filtering
  if (ipConfig.superAdminBypass && req.user?.role === 'super-admin') {
    return next();
  }
  
  // Check blacklist
  if (ipConfig.blacklist.length > 0 && isIPInList(clientIP, ipConfig.blacklist)) {
    return res.status(403).json({
      error: 'Access denied',
      code: 'IP_BLACKLISTED',
      message: 'Your IP address has been blocked'
    });
  }
  
  // Require whitelist for strict endpoints
  if (ipConfig.whitelist.length === 0) {
    return res.status(403).json({
      error: 'Access denied',
      code: 'NO_WHITELIST_CONFIGURED',
      message: 'No IP whitelist configured for this endpoint'
    });
  }
  
  if (!isIPInList(clientIP, ipConfig.whitelist)) {
    return res.status(403).json({
      error: 'Access denied',
      code: 'IP_NOT_WHITELISTED',
      message: 'Your IP address is not allowed to access this service'
    });
  }
  
  next();
};

// Configuration management functions
export const getIPConfig = (): IPConfig => {
  return { ...ipConfig };
};

export const updateIPConfig = (newConfig: Partial<IPConfig>): void => {
  ipConfig = { ...ipConfig, ...newConfig };
  console.log('IP Filter configuration updated:', ipConfig);
};

export const addToWhitelist = (ip: string): void => {
  if (!ipConfig.whitelist.includes(ip)) {
    ipConfig.whitelist.push(ip);
    console.log(`IP ${ip} added to whitelist`);
  }
};

export const removeFromWhitelist = (ip: string): void => {
  ipConfig.whitelist = ipConfig.whitelist.filter(whitelistedIP => whitelistedIP !== ip);
  console.log(`IP ${ip} removed from whitelist`);
};

export const addToBlacklist = (ip: string): void => {
  if (!ipConfig.blacklist.includes(ip)) {
    ipConfig.blacklist.push(ip);
    console.log(`IP ${ip} added to blacklist`);
  }
};

export const removeFromBlacklist = (ip: string): void => {
  ipConfig.blacklist = ipConfig.blacklist.filter(blacklistedIP => blacklistedIP !== ip);
  console.log(`IP ${ip} removed from blacklist`);
};

export const clearWhitelist = (): void => {
  ipConfig.whitelist = [];
  console.log('IP whitelist cleared');
};

export const clearBlacklist = (): void => {
  ipConfig.blacklist = [];
  console.log('IP blacklist cleared');
};

// IP status check function
export const getIPStatus = (req: AuthenticatedRequest): object => {
  const clientIP = getRealIP(req);
  const isWhitelisted = ipConfig.whitelist.length === 0 || isIPInList(clientIP, ipConfig.whitelist);
  const isBlacklisted = isIPInList(clientIP, ipConfig.blacklist);
  const canBypass = canBypassIPRestrictions(req);
  
  return {
    clientIP,
    isWhitelisted,
    isBlacklisted,
    canBypass,
    config: {
      enabled: ipConfig.enabled,
      whitelistCount: ipConfig.whitelist.length,
      blacklistCount: ipConfig.blacklist.length,
      adminBypass: ipConfig.adminBypass,
      superAdminBypass: ipConfig.superAdminBypass
    }
  };
};

// Health check for IP filtering
export const ipFilterHealthCheck = (req: Request, res: Response): void => {
  const clientIP = getRealIP(req);
  
  res.json({
    status: 'OK',
    service: 'IP Filter',
    timestamp: new Date().toISOString(),
    clientIP,
    config: {
      enabled: ipConfig.enabled,
      whitelistCount: ipConfig.whitelist.length,
      blacklistCount: ipConfig.blacklist.length
    }
  });
};

export default ipFilterMiddleware;
