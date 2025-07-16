import express from 'express';
import { VotingSessionModel } from '../models';
import { authenticateToken, requireMemberOrAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = express.Router();

// @desc    Get voting sessions
// @route   GET /api/v1/voting
// @access  Private
router.get('/', authenticateToken, requireMemberOrAdmin, async (req, res) => {
  try {
    const votingSessions = await VotingSessionModel.find().sort({ createdAt: -1 });

    const response: ApiResponse<typeof votingSessions> = {
      success: true,
      data: votingSessions
    };

    res.json(response);
  } catch (error) {
    logger.error('Get voting sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve voting sessions'
    });
  }
});

export default router;
