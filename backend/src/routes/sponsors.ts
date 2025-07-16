import express from 'express';
import { SponsorModel } from '../models';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = express.Router();

// @desc    Get all sponsors
// @route   GET /api/v1/sponsors
// @access  Private (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sponsors = await SponsorModel.find().sort({ createdAt: -1 });

    const response: ApiResponse<typeof sponsors> = {
      success: true,
      data: sponsors
    };

    res.json(response);
  } catch (error) {
    logger.error('Get sponsors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sponsors'
    });
  }
});

// @desc    Get sponsor by ID
// @route   GET /api/v1/sponsors/:id
// @access  Private (Admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sponsor = await SponsorModel.findById(req.params.id);
    
    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: 'Sponsor not found'
      });
    }

    const response: ApiResponse<typeof sponsor> = {
      success: true,
      data: sponsor
    };

    res.json(response);
  } catch (error) {
    logger.error('Get sponsor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sponsor'
    });
  }
});

// @desc    Create new sponsor
// @route   POST /api/v1/sponsors
// @access  Private (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sponsor = new SponsorModel(req.body);
    await sponsor.save();

    logger.info(`New sponsor created: ${sponsor.sponsorCode}`);

    const response: ApiResponse<typeof sponsor> = {
      success: true,
      data: sponsor,
      message: 'Sponsor created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Create sponsor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sponsor'
    });
  }
});

export default router;
