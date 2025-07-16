import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { MemberModel, AuditLogModel } from '../models';
import { authenticateToken, requireAdmin, requireMemberAccess } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse, QueryParams } from '../types';

const router = express.Router();

// Validation rules
const memberValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('nationality').notEmpty().withMessage('Nationality is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('nationalId').notEmpty().withMessage('National ID is required'),
  body('kraPin').notEmpty().withMessage('KRA PIN is required'),
  body('dateOfJoining').isISO8601().withMessage('Valid joining date is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('maritalStatus').isIn(['Single', 'Married', 'Separated', 'Divorced', 'Widow']).withMessage('Invalid marital status'),
  body('basicSalary').isNumeric().withMessage('Basic salary must be a number'),
  body('contributionRate').optional().isNumeric().withMessage('Contribution rate must be a number'),
  body('sponsorContributionRate').optional().isNumeric().withMessage('Sponsor contribution rate must be a number'),
  body('medicalLimitInpatient').optional().isNumeric().withMessage('Medical limit inpatient must be a number'),
  body('medicalLimitOutpatient').optional().isNumeric().withMessage('Medical limit outpatient must be a number')
];

// Generate member number
const generateMemberNumber = async (): Promise<string> => {
  const lastMember = await MemberModel.findOne({}, {}, { sort: { 'memberNumber': -1 } });
  let nextNumber = 1;
  
  if (lastMember && lastMember.memberNumber) {
    const lastNumber = parseInt(lastMember.memberNumber.replace('M', ''));
    nextNumber = lastNumber + 1;
  }
  
  return `M${nextNumber.toString().padStart(6, '0')}`;
};

// @desc    Get all members
// @route   GET /api/v1/members
// @access  Private (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = ''
    } = req.query as QueryParams;

    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());
    const skip = (pageNum - 1) * limitNum;

    // Build search query
    const searchQuery: any = {};
    if (search) {
      searchQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { memberNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      searchQuery.membershipStatus = status;
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const members = await MemberModel.find(searchQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await MemberModel.countDocuments(searchQuery);

    const response: ApiResponse<typeof members> = {
      success: true,
      data: members,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };

    res.json(response);
  } catch (error) {
    logger.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve members'
    });
  }
});

// @desc    Get member by ID
// @route   GET /api/v1/members/:id
// @access  Private (Member can access own data, Admin can access all)
router.get('/:id', authenticateToken, requireMemberAccess, async (req, res) => {
  try {
    const member = await MemberModel.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const response: ApiResponse<typeof member> = {
      success: true,
      data: member
    };

    res.json(response);
  } catch (error) {
    logger.error('Get member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve member'
    });
  }
});

// @desc    Create new member
// @route   POST /api/v1/members
// @access  Private (Admin only)
router.post('/', authenticateToken, requireAdmin, memberValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    // Check if member with same email or nationalId already exists
    const existingMember = await MemberModel.findOne({
      $or: [
        { email: req.body.email },
        { nationalId: req.body.nationalId }
      ]
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Member with this email or national ID already exists'
      });
    }

    // Generate member number
    const memberNumber = await generateMemberNumber();

    // Calculate expected retirement date (assuming 60 years retirement age)
    const expectedRetirement = new Date(req.body.dateOfBirth);
    expectedRetirement.setFullYear(expectedRetirement.getFullYear() + 60);

    const memberData = {
      ...req.body,
      memberNumber,
      expectedRetirement,
      updatedBy: req.user?.userId
    };

    const member = new MemberModel(memberData);
    await member.save();

    // Create audit log
    await AuditLogModel.create({
      memberId: member._id,
      action: 'Member Created',
      afterValue: memberData,
      userId: req.user?.userId,
      userRole: req.user?.role,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown'
    });

    logger.info(`New member created: ${member.memberNumber}`);

    const response: ApiResponse<typeof member> = {
      success: true,
      data: member,
      message: 'Member created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Create member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create member'
    });
  }
});

// @desc    Update member
// @route   PUT /api/v1/members/:id
// @access  Private (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const memberId = req.params.id;
    
    // Get current member data for audit log
    const currentMember = await MemberModel.findById(memberId);
    if (!currentMember) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Check if email or nationalId is being changed to existing value
    if (req.body.email || req.body.nationalId) {
      const existingMember = await MemberModel.findOne({
        _id: { $ne: memberId },
        $or: [
          ...(req.body.email ? [{ email: req.body.email }] : []),
          ...(req.body.nationalId ? [{ nationalId: req.body.nationalId }] : [])
        ]
      });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'Member with this email or national ID already exists'
        });
      }
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user?.userId
    };

    const updatedMember = await MemberModel.findByIdAndUpdate(
      memberId,
      updateData,
      { new: true, runValidators: true }
    );

    // Create audit log
    await AuditLogModel.create({
      memberId: memberId,
      action: 'Member Updated',
      beforeValue: currentMember.toObject(),
      afterValue: updateData,
      userId: req.user?.userId,
      userRole: req.user?.role,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown'
    });

    logger.info(`Member updated: ${updatedMember?.memberNumber}`);

    const response: ApiResponse<typeof updatedMember> = {
      success: true,
      data: updatedMember,
      message: 'Member updated successfully'
    };

    res.json(response);
  } catch (error) {
    logger.error('Update member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update member'
    });
  }
});

// @desc    Delete member
// @route   DELETE /api/v1/members/:id
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const memberId = req.params.id;
    
    const member = await MemberModel.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Instead of hard delete, set status to inactive
    member.membershipStatus = 'Inactive';
    member.updatedBy = req.user?.userId || 'System';
    await member.save();

    // Create audit log
    await AuditLogModel.create({
      memberId: memberId,
      action: 'Member Deactivated',
      beforeValue: { membershipStatus: 'Active' },
      afterValue: { membershipStatus: 'Inactive' },
      userId: req.user?.userId,
      userRole: req.user?.role,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown'
    });

    logger.info(`Member deactivated: ${member.memberNumber}`);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Member deactivated successfully'
    };

    res.json(response);
  } catch (error) {
    logger.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate member'
    });
  }
});

// @desc    Get member statistics
// @route   GET /api/v1/members/stats
// @access  Private (Admin only)
router.get('/analytics/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalMembers = await MemberModel.countDocuments();
    const activeMembers = await MemberModel.countDocuments({ membershipStatus: 'Active' });
    const inactiveMembers = await MemberModel.countDocuments({ membershipStatus: 'Inactive' });
    const suspendedMembers = await MemberModel.countDocuments({ membershipStatus: 'Suspended' });

    // Get member registration trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const memberTrend = await MemberModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const stats = {
      totalMembers,
      activeMembers,
      inactiveMembers,
      suspendedMembers,
      memberTrend
    };

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats
    };

    res.json(response);
  } catch (error) {
    logger.error('Get member stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve member statistics'
    });
  }
});

export default router;
