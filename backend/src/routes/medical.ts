import express from 'express';
import { MedicalClaimModel } from '../models';
import { authenticateToken, requireMemberOrAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = express.Router();

// @desc    Get medical claims
// @route   GET /api/v1/medical
// @access  Private
router.get('/', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const searchQuery: any = {};
    
    // If user is a member, only show their medical claims
    if (req.user?.role === 'Member' && req.user?.memberId) {
      searchQuery.memberId = req.user.memberId;
    }

    const medicalClaims = await MedicalClaimModel.find(searchQuery).sort({ createdAt: -1 });

    const response: ApiResponse<typeof medicalClaims> = {
      success: true,
      data: medicalClaims
    };

    res.json(response);
  } catch (error) {
    logger.error('Get medical claims error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve medical claims'
    });
  }
});

// @desc    Create new medical claim
// @route   POST /api/v1/medical
// @access  Private
router.post('/', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const medicalClaim = new MedicalClaimModel(req.body);
    await medicalClaim.save();

    logger.info(`New medical claim created: ${medicalClaim._id}`);

    const response: ApiResponse<typeof medicalClaim> = {
      success: true,
      data: medicalClaim,
      message: 'Medical claim created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Create medical claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create medical claim'
    });
  }
});

export default router;
