import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/config/app';
import { prisma } from '@/config/database';
import { createError } from '@/api/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const authController = {
  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Validation failed', 400);
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw createError('Account is disabled', 401);
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        memberNumber: user.memberNumber,
      },
    });
  },

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Validation failed', 400);
    }

    const { email, password, firstName, lastName, memberNumber } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        memberNumber,
        role: 'Member',
        isActive: true,
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        memberNumber: user.memberNumber,
      },
    });
  },

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw createError('Invalid refresh token', 401);
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: storedToken.user.id, email: storedToken.user.email, role: storedToken.user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({ accessToken });
  },

  async logout(req: Request, res: Response) {
    // Implementation depends on how you want to handle logout
    // Could invalidate refresh tokens, add to blacklist, etc.
    res.json({ message: 'Logged out successfully' });
  },

  async forgotPassword(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Validation failed', 400);
    }

    const { email } = req.body;

    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          firstName: true,
          isActive: true,
        },
      });

      // Always return success to prevent email enumeration
      // but only send email if user exists and is active
      if (user && user.isActive) {
        // Check if user has reached token generation limit
        const tokenService = (await import('@/services/auth/tokenService')).tokenService;
        const limitReached = await tokenService.isTokenGenerationLimitReached(user.id);
        
        if (limitReached) {
          // Log this for security monitoring
          logger.warn('Password reset token generation limit reached', { userId: user.id, email });
          // Still return success to prevent information disclosure
        } else {
          // Generate password reset token
          const resetToken = await tokenService.createPasswordResetToken(user.id);
          
          // Send password reset email
          const emailService = (await import('@/services/email/emailService')).emailService;
          const emailSent = await emailService.sendPasswordResetEmail(
            user.email,
            resetToken,
            user.firstName
          );
          
          if (!emailSent) {
            logger.error('Failed to send password reset email', { userId: user.id, email });
            // Don't throw error, still return success
          }

          // Log the request for security monitoring
          logger.info('Password reset requested', { userId: user.id, email });
        }
      } else {
        // Log invalid email attempts for security monitoring
        logger.warn('Password reset requested for invalid email', { email });
      }

      // Always return success message
      res.json({
        message: 'If an account with that email exists, we have sent you a password reset link.',
      });
    } catch (error) {
      logger.error('Password reset request failed:', error);
      throw createError('Failed to process password reset request', 500);
    }
  },

  async resetPassword(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Validation failed', 400);
    }

    const { token, password } = req.body;

    try {
      // Validate the reset token
      const tokenService = (await import('@/services/auth/tokenService')).tokenService;
      const tokenValidation = await tokenService.validatePasswordResetToken(token);
      
      if (!tokenValidation.isValid) {
        throw createError(tokenValidation.error || 'Invalid or expired reset token', 400);
      }

      // Validate password strength
      const { validatePassword } = await import('@/utils/passwordValidation');
      const passwordValidation = validatePassword(password);
      
      if (!passwordValidation.isValid) {
        throw createError(`Password validation failed: ${passwordValidation.errors.join(', ')}`, 400);
      }

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: tokenValidation.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          password: true,
        },
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Check if new password is different from current password
      const { isPasswordDifferent } = await import('@/utils/passwordValidation');
      const isSamePassword = await bcrypt.compare(password, user.password);
      
      if (isSamePassword) {
        throw createError('New password must be different from your current password', 400);
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);

      // Update user password
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });

      // Delete the used reset token
      await tokenService.deletePasswordResetToken(token);

      // Delete all other reset tokens for this user
      await tokenService.deleteAllUserTokens(user.id);

      // Send confirmation email
      const emailService = (await import('@/services/email/emailService')).emailService;
      await emailService.sendPasswordResetConfirmation(user.email, user.firstName);

      // Log the successful password reset
      logger.info('Password reset completed successfully', { userId: user.id, email: user.email });

      res.json({
        message: 'Your password has been reset successfully. You can now log in with your new password.',
      });
    } catch (error) {
      logger.error('Password reset failed:', error);
      throw error;
    }
  },

  async changePassword(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Validation failed', 400);
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    try {
      // Get user with current password
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          password: true,
        },
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw createError('Current password is incorrect', 400);
      }

      // Check if new password is different from current password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw createError('New password must be different from your current password', 400);
      }

      // Validate new password strength
      const { validatePassword } = await import('@/utils/passwordValidation');
      const passwordValidation = validatePassword(newPassword);
      
      if (!passwordValidation.isValid) {
        throw createError(`Password validation failed: ${passwordValidation.errors.join(', ')}`, 400);
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);

      // Update user password
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });

      // Clean up any existing password reset tokens
      const tokenService = (await import('@/services/auth/tokenService')).tokenService;
      await tokenService.deleteAllUserTokens(userId);

      // Send confirmation email
      const emailService = (await import('@/services/email/emailService')).emailService;
      await emailService.sendPasswordResetConfirmation(user.email, user.firstName);

      // Log the successful password change
      logger.info('Password changed successfully', { userId, email: user.email });

      res.json({
        message: 'Your password has been changed successfully.',
      });
    } catch (error) {
      logger.error('Password change failed:', error);
      throw error;
    }
  },

  async verifyEmail(req: Request, res: Response) {
    // TODO: Implement email verification logic
    res.json({ message: 'Email verified successfully' });
  },

  async getProfile(req: Request, res: Response) {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        memberNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ user });
  },
};
