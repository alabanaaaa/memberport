import express from 'express';
import { ContributionModel } from '../models';
import { authenticateToken, requireAdmin, requireMemberOrAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse, QueryParams } from '../types';

const router = express.Router();

// @desc    Get all contributions
// @route   GET /api/v1/contributions
// @access  Private
router.get('/', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = '',
      memberId = ''
    } = req.query as QueryParams & { memberId?: string };

    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());
    const skip = (pageNum - 1) * limitNum;

    // Build search query
    const searchQuery: any = {};
    
    // If user is a member, only show their contributions
    if (req.user?.role === 'Member' && req.user?.memberId) {
      searchQuery.memberId = req.user.memberId;
    } else if (memberId) {
      searchQuery.memberId = memberId;
    }

    if (search) {
      searchQuery.$or = [
        { memberNumber: { $regex: search, $options: 'i' } },
        { sponsorName: { $regex: search, $options: 'i' } },
        { sponsorCode: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      searchQuery.status = status;
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const contributions = await ContributionModel.find(searchQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await ContributionModel.countDocuments(searchQuery);

    const response: ApiResponse<typeof contributions> = {
      success: true,
      data: contributions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };

    res.json(response);
  } catch (error) {
    logger.error('Get contributions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contributions'
    });
  }
});

// @desc    Get contribution by ID
// @route   GET /api/v1/contributions/:id
// @access  Private
router.get('/:id', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const contribution = await ContributionModel.findById(req.params.id);
    
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Check if member is accessing their own data
    if (req.user?.role === 'Member' && req.user?.memberId !== contribution.memberId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const response: ApiResponse<typeof contribution> = {
      success: true,
      data: contribution
    };

    res.json(response);
  } catch (error) {
    logger.error('Get contribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contribution'
    });
  }
});

// @desc    Create new contribution
// @route   POST /api/v1/contributions
// @access  Private (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contributionData = {
      ...req.body,
      processedBy: req.user?.userId
    };

    const contribution = new ContributionModel(contributionData);
    await contribution.save();

    logger.info(`New contribution created: ${contribution._id}`);

    const response: ApiResponse<typeof contribution> = {
      success: true,
      data: contribution,
      message: 'Contribution created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Create contribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create contribution'
    });
  }
});

// Add more routes as needed...

export default router;
