import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, requireMemberOrAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow specific file types
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xlsx|xls|csv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and office documents are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  },
  fileFilter: fileFilter
});

// @desc    Upload single file
// @route   POST /api/v1/upload/single
// @access  Private
router.post('/single', authenticateToken, requireMemberOrAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileData = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`
    };

    logger.info(`File uploaded: ${req.file.originalname}`);

    const response: ApiResponse<typeof fileData> = {
      success: true,
      data: fileData,
      message: 'File uploaded successfully'
    };

    res.json(response);
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    });
  }
});

// @desc    Upload multiple files
// @route   POST /api/v1/upload/multiple
// @access  Private
router.post('/multiple', authenticateToken, requireMemberOrAdmin, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const files = (req.files as Express.Multer.File[]).map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`
    }));

    logger.info(`${files.length} files uploaded`);

    const response: ApiResponse<typeof files> = {
      success: true,
      data: files,
      message: 'Files uploaded successfully'
    };

    res.json(response);
  } catch (error) {
    logger.error('Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
});

export default router;
