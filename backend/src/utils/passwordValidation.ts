import { z } from 'zod';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

/**
 * Password validation schema using Zod
 */
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

/**
 * Common passwords that should not be allowed
 */
const commonPasswords = [
  'password',
  'password123',
  '123456',
  '123456789',
  'qwerty',
  'abc123',
  'password1',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  'dragon',
  'master',
  'superman',
  'qwerty123',
  'password!',
  'Password123',
  'admin123',
  'root',
  'user',
  'guest',
  'test',
  'changeme',
  'default',
  'temp',
  'temporary',
  'memberport',
  'pension',
  'member',
  'user123',
  'admin!',
  'password@',
  'qwerty!',
  'welcome123',
  'login',
  'access',
  'security',
  'secret',
  'private',
  'confidential',
];

/**
 * Validate password strength and requirements
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Check if password is empty
  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required'],
      strength: 'weak',
      score: 0,
    };
  }

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  // Check maximum length
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Check for special characters
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Check against common passwords
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more unique password');
  }

  // Check for repetitive characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain more than 2 consecutive identical characters');
  }

  // Check for keyboard patterns
  const keyboardPatterns = [
    'qwerty', 'asdf', 'zxcv', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
    '1234567890', '0987654321', 'abcdefg', 'zyxwvut'
  ];

  for (const pattern of keyboardPatterns) {
    if (password.toLowerCase().includes(pattern)) {
      errors.push('Password should not contain keyboard patterns');
      break;
    }
  }

  // Additional scoring for length
  if (password.length >= 12) {
    score += 1;
  }
  if (password.length >= 16) {
    score += 1;
  }

  // Additional scoring for character diversity
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.6) {
    score += 1;
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 5 && errors.length === 0) {
    strength = 'medium';
  }
  if (score >= 7 && errors.length === 0) {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score,
  };
}

/**
 * Check if password has been breached (placeholder for future implementation)
 */
export async function checkPasswordBreach(password: string): Promise<boolean> {
  // TODO: Implement integration with HaveIBeenPwned API
  // For now, just return false (not breached)
  return false;
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Check if new password is different from old password
 */
export function isPasswordDifferent(oldPassword: string, newPassword: string): boolean {
  return oldPassword !== newPassword;
}

/**
 * Get password strength description
 */
export function getPasswordStrengthDescription(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'weak':
      return 'Weak - Your password is vulnerable to attacks';
    case 'medium':
      return 'Medium - Your password is reasonably secure';
    case 'strong':
      return 'Strong - Your password is very secure';
    default:
      return 'Unknown';
  }
}

/**
 * Get password improvement suggestions
 */
export function getPasswordSuggestions(result: PasswordValidationResult): string[] {
  const suggestions: string[] = [];

  if (result.strength === 'weak') {
    suggestions.push('Use a longer password (12+ characters)');
    suggestions.push('Mix uppercase and lowercase letters');
    suggestions.push('Include numbers and special characters');
    suggestions.push('Avoid common words and patterns');
  } else if (result.strength === 'medium') {
    suggestions.push('Consider using a longer password for better security');
    suggestions.push('Use more unique character combinations');
  }

  return suggestions;
}
