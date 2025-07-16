import express from 'express';
import { ClaimModel } from '../models';
import { authenticateToken, requireAdmin, requireMemberOrAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = express.Router();

// @desc    Get all claims
// @route   GET /api/v1/claims
// @access  Private
router.get('/', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const searchQuery: any = {};
    
    // If user is a member, only show their claims
    if (req.user?.role === 'Member' && req.user?.memberId) {
      searchQuery.memberId = req.user.memberId;
    }

    const claims = await ClaimModel.find(searchQuery).sort({ createdAt: -1 });

    const response: ApiResponse<typeof claims> = {
      success: true,
      data: claims
    };

    res.json(response);
  } catch (error) {
    logger.error('Get claims error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve claims'
    });
  }
});

// @desc    Get claim by ID
// @route   GET /api/v1/claims/:id
// @access  Private
router.get('/:id', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const claim = await ClaimModel.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Check if member is accessing their own data
    if (req.user?.role === 'Member' && req.user?.memberId !== claim.memberId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const response: ApiResponse<typeof claim> = {
      success: true,
      data: claim
    };

    res.json(response);
  } catch (error) {
    logger.error('Get claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve claim'
    });
  }
});

// @desc    Create new claim
// @route   POST /api/v1/claims
// @access  Private
router.post('/', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const claimData = {
      ...req.body,
      submittedDate: new Date()
    };

    const claim = new ClaimModel(claimData);
    await claim.save();

    logger.info(`New claim created: ${claim._id}`);

    const response: ApiResponse<typeof claim> = {
      success: true,
      data: claim,
      message: 'Claim created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Create claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create claim'
    });
  }
});

export default router;
