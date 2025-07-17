import { Request, Response, NextFunction } from 'express';
import xss from 'xss';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// Initialize DOMPurify with jsdom
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Sanitization configuration
interface SanitizerConfig {
  enabled: boolean;
  xssProtection: boolean;
  htmlSanitization: boolean;
  sqlInjectionProtection: boolean;
  noSQLInjectionProtection: boolean;
  pathTraversalProtection: boolean;
  scriptTagProtection: boolean;
  strictMode: boolean;
  skipRoutes: string[];
  skipFields: string[];
}

// Default configuration
const defaultConfig: SanitizerConfig = {
  enabled: process.env.SANITIZER_ENABLED !== 'false',
  xssProtection: process.env.XSS_PROTECTION !== 'false',
  htmlSanitization: process.env.HTML_SANITIZATION !== 'false',
  sqlInjectionProtection: process.env.SQL_INJECTION_PROTECTION !== 'false',
  noSQLInjectionProtection: process.env.NOSQL_INJECTION_PROTECTION !== 'false',
  pathTraversalProtection: process.env.PATH_TRAVERSAL_PROTECTION !== 'false',
  scriptTagProtection: process.env.SCRIPT_TAG_PROTECTION !== 'false',
  strictMode: process.env.SANITIZER_STRICT_MODE === 'true',
  skipRoutes: process.env.SANITIZER_SKIP_ROUTES?.split(',').map(route => route.trim()) || [],
  skipFields: process.env.SANITIZER_SKIP_FIELDS?.split(',').map(field => field.trim()) || []
};

// Current configuration
let sanitizerConfig: SanitizerConfig = { ...defaultConfig };

// Common patterns for various injection types
const patterns = {
  sqlInjection: [
    /(\%27)|(')|(--)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(')|(--)|(\%23)|(#))/i,
    /\w*((\%27)|('))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|('))\s*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|('))\s*union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+set/i,
    /create\s+table/i,
    /alter\s+table/i,
    /truncate\s+table/i
  ],
  
  noSQLInjection: [
    /\$where/i,
    /\$ne/i,
    /\$gt/i,
    /\$lt/i,
    /\$gte/i,
    /\$lte/i,
    /\$in/i,
    /\$nin/i,
    /\$regex/i,
    /\$exists/i,
    /\$elemMatch/i,
    /\$size/i,
    /\$all/i,
    /\$or/i,
    /\$and/i,
    /\$not/i,
    /\$nor/i,
    /\$text/i,
    /\$search/i,
    /\$slice/i,
    /\$push/i,
    /\$pull/i,
    /\$pop/i,
    /\$unset/i,
    /\$set/i,
    /\$inc/i,
    /\$mul/i,
    /\$rename/i,
    /\$min/i,
    /\$max/i,
    /\$currentDate/i,
    /\$addToSet/i,
    /\$each/i,
    /\$position/i,
    /\$sort/i,
    /\$bit/i
  ],
  
  pathTraversal: [
    /\.\./,
    /\.\\/,
    /\.\.\\/,
    /\.\.\\\\/,
    /%2e%2e/i,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    /\.\.%2f/i,
    /\.\.%5c/i,
    /%252e%252e/i,
    /\.\.\//,
    /\.\.\\\\/,
    /\.\.%252f/i,
    /\.\.%255c/i
  ],
  
  scriptTags: [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /onload=/gi,
    /onerror=/gi,
    /onclick=/gi,
    /onmouseover=/gi,
    /onfocus=/gi,
    /onblur=/gi,
    /onchange=/gi,
    /onsubmit=/gi
  ]
};

// Helper function to check if route should be skipped
const shouldSkipRoute = (path: string): boolean => {
  return sanitizerConfig.skipRoutes.some(route => {
    if (route.includes('*')) {
      const regex = new RegExp(route.replace(/\*/g, '.*'));
      return regex.test(path);
    }
    return path.startsWith(route);
  });
};

// Helper function to check if field should be skipped
const shouldSkipField = (field: string): boolean => {
  return sanitizerConfig.skipFields.includes(field);
};

// Sanitize string value
const sanitizeString = (value: string, field?: string): string => {
  if (!value || typeof value !== 'string') {
    return value;
  }
  
  // Skip if field is in skip list
  if (field && shouldSkipField(field)) {
    return value;
  }
  
  let sanitized = value;
  
  // XSS Protection
  if (sanitizerConfig.xssProtection) {
    sanitized = xss(sanitized, {
      whiteList: {
        // Allow common safe HTML tags if not in strict mode
        ...(sanitizerConfig.strictMode ? {} : {
          p: [],
          br: [],
          strong: [],
          em: [],
          u: [],
          i: [],
          b: [],
          span: ['class'],
          div: ['class'],
          h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
          ul: [], ol: [], li: [],
          a: ['href', 'title', 'target'],
          img: ['src', 'alt', 'title', 'width', 'height']
        })
      },
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style']
    });
  }
  
  // HTML Sanitization with DOMPurify
  if (sanitizerConfig.htmlSanitization) {
    sanitized = purify.sanitize(sanitized, {
      ALLOWED_TAGS: sanitizerConfig.strictMode ? [] : [
        'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'
      ],
      ALLOWED_ATTR: sanitizerConfig.strictMode ? [] : [
        'href', 'title', 'target', 'src', 'alt', 'width', 'height', 'class'
      ],
      FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'textarea', 'button', 'select', 'option'],
      FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit']
    });
  }
  
  // SQL Injection Protection
  if (sanitizerConfig.sqlInjectionProtection) {
    for (const pattern of patterns.sqlInjection) {
      if (pattern.test(sanitized)) {
        console.warn(`SQL Injection attempt detected: ${field || 'unknown field'}`);
        if (sanitizerConfig.strictMode) {
          throw new Error('Potential SQL injection detected');
        }
        // Remove suspicious patterns
        sanitized = sanitized.replace(pattern, '');
      }
    }
  }
  
  // NoSQL Injection Protection
  if (sanitizerConfig.noSQLInjectionProtection) {
    for (const pattern of patterns.noSQLInjection) {
      if (pattern.test(sanitized)) {
        console.warn(`NoSQL Injection attempt detected: ${field || 'unknown field'}`);
        if (sanitizerConfig.strictMode) {
          throw new Error('Potential NoSQL injection detected');
        }
        // Remove suspicious patterns
        sanitized = sanitized.replace(pattern, '');
      }
    }
  }
  
  // Path Traversal Protection
  if (sanitizerConfig.pathTraversalProtection) {
    for (const pattern of patterns.pathTraversal) {
      if (pattern.test(sanitized)) {
        console.warn(`Path traversal attempt detected: ${field || 'unknown field'}`);
        if (sanitizerConfig.strictMode) {
          throw new Error('Potential path traversal detected');
        }
        // Remove suspicious patterns
        sanitized = sanitized.replace(pattern, '');
      }
    }
  }
  
  // Script Tag Protection
  if (sanitizerConfig.scriptTagProtection) {
    for (const pattern of patterns.scriptTags) {
      if (pattern.test(sanitized)) {
        console.warn(`Script tag attempt detected: ${field || 'unknown field'}`);
        if (sanitizerConfig.strictMode) {
          throw new Error('Potential script injection detected');
        }
        // Remove suspicious patterns
        sanitized = sanitized.replace(pattern, '');
      }
    }
  }
  
  return sanitized;
};

// Recursively sanitize object
const sanitizeObject = (obj: any, parentKey?: string): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj, parentKey);
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item, index) => sanitizeObject(item, `${parentKey}[${index}]`));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      sanitized[key] = sanitizeObject(value, fullKey);
    }
    return sanitized;
  }
  
  return obj;
};

// Main sanitization middleware
export const sanitizerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip if sanitization is disabled
    if (!sanitizerConfig.enabled) {
      return next();
    }
    
    // Skip if route is in skip list
    if (shouldSkipRoute(req.path)) {
      return next();
    }
    
    // Sanitize query parameters
    if (req.query && Object.keys(req.query).length > 0) {
      req.query = sanitizeObject(req.query, 'query');
    }
    
    // Sanitize body parameters
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = sanitizeObject(req.body, 'body');
    }
    
    // Sanitize URL parameters
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = sanitizeObject(req.params, 'params');
    }
    
    // Log sanitization activity
    console.log(`Sanitizer: Processed ${req.method} ${req.path}`);
    
    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    
    if (sanitizerConfig.strictMode) {
      return res.status(400).json({
        error: 'Input validation failed',
        code: 'SANITIZATION_ERROR',
        message: 'Request contains potentially harmful content'
      });
    }
    
    // In non-strict mode, continue with original request
    next();
  }
};

// Strict sanitization middleware for sensitive endpoints
export const strictSanitizerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalStrictMode = sanitizerConfig.strictMode;
  
  try {
    // Temporarily enable strict mode
    sanitizerConfig.strictMode = true;
    
    // Apply sanitization
    sanitizerMiddleware(req, res, (err) => {
      // Restore original strict mode setting
      sanitizerConfig.strictMode = originalStrictMode;
      
      if (err) {
        return next(err);
      }
      
      next();
    });
  } catch (error) {
    // Restore original strict mode setting
    sanitizerConfig.strictMode = originalStrictMode;
    
    return res.status(400).json({
      error: 'Input validation failed',
      code: 'STRICT_SANITIZATION_ERROR',
      message: 'Request contains potentially harmful content'
    });
  }
};

// Configuration management functions
export const getSanitizerConfig = (): SanitizerConfig => {
  return { ...sanitizerConfig };
};

export const updateSanitizerConfig = (newConfig: Partial<SanitizerConfig>): void => {
  sanitizerConfig = { ...sanitizerConfig, ...newConfig };
  console.log('Sanitizer configuration updated:', sanitizerConfig);
};

export const addSkipRoute = (route: string): void => {
  if (!sanitizerConfig.skipRoutes.includes(route)) {
    sanitizerConfig.skipRoutes.push(route);
    console.log(`Route ${route} added to sanitizer skip list`);
  }
};

export const removeSkipRoute = (route: string): void => {
  sanitizerConfig.skipRoutes = sanitizerConfig.skipRoutes.filter(r => r !== route);
  console.log(`Route ${route} removed from sanitizer skip list`);
};

export const addSkipField = (field: string): void => {
  if (!sanitizerConfig.skipFields.includes(field)) {
    sanitizerConfig.skipFields.push(field);
    console.log(`Field ${field} added to sanitizer skip list`);
  }
};

export const removeSkipField = (field: string): void => {
  sanitizerConfig.skipFields = sanitizerConfig.skipFields.filter(f => f !== field);
  console.log(`Field ${field} removed from sanitizer skip list`);
};

// Health check for sanitizer
export const sanitizerHealthCheck = (req: Request, res: Response): void => {
  res.json({
    status: 'OK',
    service: 'Input Sanitizer',
    timestamp: new Date().toISOString(),
    config: {
      enabled: sanitizerConfig.enabled,
      xssProtection: sanitizerConfig.xssProtection,
      htmlSanitization: sanitizerConfig.htmlSanitization,
      sqlInjectionProtection: sanitizerConfig.sqlInjectionProtection,
      noSQLInjectionProtection: sanitizerConfig.noSQLInjectionProtection,
      pathTraversalProtection: sanitizerConfig.pathTraversalProtection,
      scriptTagProtection: sanitizerConfig.scriptTagProtection,
      strictMode: sanitizerConfig.strictMode,
      skipRoutes: sanitizerConfig.skipRoutes.length,
      skipFields: sanitizerConfig.skipFields.length
    }
  });
};

// Manual sanitization function for specific values
export const sanitizeValue = (value: any, field?: string): any => {
  return sanitizeObject(value, field);
};

export default sanitizerMiddleware;
