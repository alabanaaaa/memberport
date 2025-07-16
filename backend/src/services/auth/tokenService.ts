import crypto from 'crypto';
import { prisma } from '@/config/database';
import { logger } from '@/utils/logger';

export interface TokenValidationResult {
  isValid: boolean;
  userId?: string;
  error?: string;
}

class TokenService {
  /**
   * Generate a secure random token for password reset
   */
  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create a password reset token for a user
   */
  async createPasswordResetToken(userId: string): Promise<string> {
    try {
      // Generate secure token
      const token = this.generateSecureToken();
      
      // Set expiration time (1 hour from now)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Clean up any existing tokens for this user
      await this.cleanupExpiredTokens(userId);

      // Create new token record
      await prisma.passwordResetToken.create({
        data: {
          token,
          userId,
          expiresAt,
        },
      });

      logger.info('Password reset token created', { userId, expiresAt });
      return token;
    } catch (error) {
      logger.error('Failed to create password reset token:', error);
      throw new Error('Failed to create password reset token');
    }
  }

  /**
   * Validate a password reset token
   */
  async validatePasswordResetToken(token: string): Promise<TokenValidationResult> {
    try {
      // Find the token in database
      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              isActive: true,
            },
          },
        },
      });

      if (!resetToken) {
        return {
          isValid: false,
          error: 'Invalid or expired reset token',
        };
      }

      // Check if token has expired
      if (resetToken.expiresAt < new Date()) {
        // Clean up expired token
        await this.deletePasswordResetToken(token);
        return {
          isValid: false,
          error: 'Reset token has expired',
        };
      }

      // Check if user is still active
      if (!resetToken.user.isActive) {
        return {
          isValid: false,
          error: 'User account is disabled',
        };
      }

      return {
        isValid: true,
        userId: resetToken.userId,
      };
    } catch (error) {
      logger.error('Failed to validate password reset token:', error);
      return {
        isValid: false,
        error: 'Token validation failed',
      };
    }
  }

  /**
   * Delete a password reset token after use
   */
  async deletePasswordResetToken(token: string): Promise<void> {
    try {
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      logger.info('Password reset token deleted', { token: token.substring(0, 8) + '...' });
    } catch (error) {
      logger.error('Failed to delete password reset token:', error);
      // Don't throw error as this is cleanup
    }
  }

  /**
   * Clean up expired tokens for a user
   */
  async cleanupExpiredTokens(userId?: string): Promise<void> {
    try {
      const where = userId 
        ? { userId, expiresAt: { lt: new Date() } }
        : { expiresAt: { lt: new Date() } };

      const deleted = await prisma.passwordResetToken.deleteMany({
        where,
      });

      if (deleted.count > 0) {
        logger.info('Cleaned up expired password reset tokens', { 
          count: deleted.count,
          userId: userId || 'all',
        });
      }
    } catch (error) {
      logger.error('Failed to cleanup expired tokens:', error);
    }
  }

  /**
   * Get all active tokens for a user (for security monitoring)
   */
  async getUserActiveTokens(userId: string): Promise<number> {
    try {
      const count = await prisma.passwordResetToken.count({
        where: {
          userId,
          expiresAt: { gt: new Date() },
        },
      });

      return count;
    } catch (error) {
      logger.error('Failed to get user active tokens:', error);
      return 0;
    }
  }

  /**
   * Delete all tokens for a user (e.g., on password change)
   */
  async deleteAllUserTokens(userId: string): Promise<void> {
    try {
      const deleted = await prisma.passwordResetToken.deleteMany({
        where: { userId },
      });

      if (deleted.count > 0) {
        logger.info('Deleted all password reset tokens for user', { 
          userId,
          count: deleted.count,
        });
      }
    } catch (error) {
      logger.error('Failed to delete user tokens:', error);
    }
  }

  /**
   * Hash a token for secure storage (optional enhancement)
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Check if user has reached maximum token generation limit
   */
  async isTokenGenerationLimitReached(userId: string, maxTokens: number = 3): Promise<boolean> {
    try {
      const count = await this.getUserActiveTokens(userId);
      return count >= maxTokens;
    } catch (error) {
      logger.error('Failed to check token generation limit:', error);
      return false;
    }
  }

  /**
   * Get token creation statistics for monitoring
   */
  async getTokenStatistics(hours: number = 24): Promise<{
    totalCreated: number;
    totalUsed: number;
    totalExpired: number;
  }> {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);

      const totalCreated = await prisma.passwordResetToken.count({
        where: {
          createdAt: { gte: since },
        },
      });

      // For used/expired, we'd need to track this in audit logs
      // For now, just return basic stats
      return {
        totalCreated,
        totalUsed: 0, // Would need audit log tracking
        totalExpired: 0, // Would need audit log tracking
      };
    } catch (error) {
      logger.error('Failed to get token statistics:', error);
      return {
        totalCreated: 0,
        totalUsed: 0,
        totalExpired: 0,
      };
    }
  }
}

export const tokenService = new TokenService();
