import express from 'express';
import { 
  PendingApprovalModel, 
  BulkOperationModel, 
  SystemAlertModel,
  MemberModel,
  ContributionModel,
  ClaimModel
} from '../models';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = express.Router();

// @desc    Get admin dashboard data
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalMembers,
      activeMembers,
      totalContributions,
      monthlyContributions,
      totalClaims,
      pendingClaims,
      pendingApprovals,
      systemAlerts
    ] = await Promise.all([
      MemberModel.countDocuments(),
      MemberModel.countDocuments({ membershipStatus: 'Active' }),
      ContributionModel.aggregate([
        { $group: { _id: null, total: { $sum: '$totalContribution' } } }
      ]),
      ContributionModel.aggregate([
        { 
          $match: { 
            createdAt: { 
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
            } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalContribution' } } }
      ]),
      ClaimModel.countDocuments(),
      ClaimModel.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } }),
      PendingApprovalModel.countDocuments({ status: 'Pending' }),
      SystemAlertModel.countDocuments({ isRead: false })
    ]);

    const dashboardData = {
      totalMembers,
      activeMembers,
      totalContributions: totalContributions[0]?.total || 0,
      monthlyContributions: monthlyContributions[0]?.total || 0,
      totalClaims,
      pendingClaims,
      medicalExpenditure: 0, // Calculate from medical claims
      accountBalance: 0, // Calculate from all contributions minus claims
      pendingApprovals,
      systemAlerts
    };

    const response: ApiResponse<typeof dashboardData> = {
      success: true,
      data: dashboardData
    };

    res.json(response);
  } catch (error) {
    logger.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data'
    });
  }
});

// @desc    Get pending approvals
// @route   GET /api/v1/admin/approvals
// @access  Private (Admin only)
router.get('/approvals', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const approvals = await PendingApprovalModel.find().sort({ submittedDate: -1 });

    const response: ApiResponse<typeof approvals> = {
      success: true,
      data: approvals
    };

    res.json(response);
  } catch (error) {
    logger.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pending approvals'
    });
  }
});

// @desc    Get bulk operations
// @route   GET /api/v1/admin/bulk-operations
// @access  Private (Admin only)
router.get('/bulk-operations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const bulkOperations = await BulkOperationModel.find().sort({ uploadedDate: -1 });

    const response: ApiResponse<typeof bulkOperations> = {
      success: true,
      data: bulkOperations
    };

    res.json(response);
  } catch (error) {
    logger.error('Get bulk operations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bulk operations'
    });
  }
});

// @desc    Get system alerts
// @route   GET /api/v1/admin/alerts
// @access  Private (Admin only)
router.get('/alerts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const alerts = await SystemAlertModel.find().sort({ createdDate: -1 });

    const response: ApiResponse<typeof alerts> = {
      success: true,
      data: alerts
    };

    res.json(response);
  } catch (error) {
    logger.error('Get system alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system alerts'
    });
  }
});

export default router;
