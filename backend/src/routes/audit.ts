import express from 'express';
import { AuditLogModel } from '../models';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = express.Router();

// @desc    Get audit logs
// @route   GET /api/v1/audit
// @access  Private (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const auditLogs = await AuditLogModel.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .populate('memberId', 'firstName lastName memberNumber')
      .populate('userId', 'name email');

    const response: ApiResponse<typeof auditLogs> = {
      success: true,
      data: auditLogs
    };

    res.json(response);
  } catch (error) {
    logger.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit logs'
    });
  }
});

export default router;
