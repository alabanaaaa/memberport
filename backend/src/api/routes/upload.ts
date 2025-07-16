import { Router } from 'express';
import { authenticate } from '@/api/middleware/auth';
import { uploadRateLimiter } from '@/api/middleware/rateLimiter';
import { asyncHandler } from '@/api/middleware/errorHandler';
import { uploadController } from '@/api/controllers/upload';

const router = Router();

router.use(authenticate);
router.use(uploadRateLimiter);

router.post('/document', asyncHandler(uploadController.uploadDocument));
router.post('/image', asyncHandler(uploadController.uploadImage));
router.get('/file/:id', asyncHandler(uploadController.getFile));
router.delete('/file/:id', asyncHandler(uploadController.deleteFile));

export { router as uploadRoutes };
