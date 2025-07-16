import express from 'express';
import { BeneficiaryModel } from '../models';
import { authenticateToken, requireMemberOrAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = express.Router();

// @desc    Get beneficiaries
// @route   GET /api/v1/beneficiaries
// @access  Private
router.get('/', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const searchQuery: any = {};
    
    // If user is a member, only show their beneficiaries
    if (req.user?.role === 'Member' && req.user?.memberId) {
      searchQuery.memberId = req.user.memberId;
    }

    const beneficiaries = await BeneficiaryModel.find(searchQuery).sort({ createdAt: -1 });

    const response: ApiResponse<typeof beneficiaries> = {
      success: true,
      data: beneficiaries
    };

    res.json(response);
  } catch (error) {
    logger.error('Get beneficiaries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve beneficiaries'
    });
  }
});

// @desc    Create new beneficiary
// @route   POST /api/v1/beneficiaries
// @access  Private
router.post('/', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const beneficiary = new BeneficiaryModel(req.body);
    await beneficiary.save();

    logger.info(`New beneficiary created: ${beneficiary._id}`);

    const response: ApiResponse<typeof beneficiary> = {
      success: true,
      data: beneficiary,
      message: 'Beneficiary created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Create beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create beneficiary'
    });
  }
});

export default router;
