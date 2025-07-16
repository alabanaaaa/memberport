import express from 'express';
import { body, validationResult } from 'express-validator';
import { UserModel, MemberModel } from '../models';
import { generateToken, generateRefreshToken, verifyRefreshToken, authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['Member', 'Admin', 'Pension Officer', 'Approver']).withMessage('Invalid role'),
  body('memberId').optional().isString()
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required')
];

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public (but typically restricted to admin)
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { name, email, password, role, memberId } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // If role is Member, verify member exists
    if (role === 'Member' && memberId) {
      const member = await MemberModel.findById(memberId);
      if (!member) {
        return res.status(400).json({
          success: false,
          message: 'Member not found'
        });
      }
    }

    // Create new user
    const user = new UserModel({
      name,
      email,
      password,
      role,
      memberId: role === 'Member' ? memberId : undefined
    });

    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberId: user.memberId,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    logger.info(`New user registered: ${email}`);

    const response: ApiResponse<typeof userResponse> = {
      success: true,
      data: userResponse,
      message: 'User registered successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      memberId: user.memberId,
      permissions: user.permissions
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberId: user.memberId,
      permissions: user.permissions,
      lastLogin: user.lastLogin
    };

    logger.info(`User logged in: ${email}`);

    const response: ApiResponse<{
      user: typeof userResponse;
      accessToken: string;
      refreshToken: string;
    }> = {
      success: true,
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      },
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
router.post('/refresh', refreshTokenValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if user still exists and is active
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Generate new access token
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      memberId: user.memberId,
      permissions: user.permissions
    };

    const newAccessToken = generateToken(tokenPayload);

    const response: ApiResponse<{ accessToken: string }> = {
      success: true,
      data: { accessToken: newAccessToken },
      message: 'Token refreshed successfully'
    };

    res.json(response);
  } catch (error) {
    logger.error('Token refresh error:', error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// @desc    Get current user profile
// @route   GET /api/v1/auth/profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      message: 'Profile retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    logger.error('Profile retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
router.put('/profile', authenticateToken, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { name, email } = req.body;
    const userId = req.user?.userId;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await UserModel.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { 
        ...(name && { name }),
        ...(email && { email })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      message: 'Profile updated successfully'
    };

    res.json(response);
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    const user = await UserModel.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Password changed successfully'
    };

    res.json(response);
  } catch (error) {
    logger.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/v1/auth/logout
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  // In a JWT-based system, logout is typically handled client-side
  // by removing the token from storage. Here we just confirm the logout.
  logger.info(`User logged out: ${req.user?.email}`);
  
  const response: ApiResponse<null> = {
    success: true,
    message: 'Logout successful'
  };

  res.json(response);
});

export default router;
