import { Router } from 'express';
import { authenticate, selfOrAdmin, adminOnly } from '@/api/middleware/auth';
import { asyncHandler } from '@/api/middleware/errorHandler';
import { contributionController } from '@/api/controllers/contributions';

const router = Router();

// All contribution routes require authentication
router.use(authenticate);

router.get('/', adminOnly, asyncHandler(contributionController.getContributions));
router.get('/:id', selfOrAdmin, asyncHandler(contributionController.getContribution));
router.post('/', adminOnly, asyncHandler(contributionController.createContribution));
router.put('/:id', adminOnly, asyncHandler(contributionController.updateContribution));
router.delete('/:id', adminOnly, asyncHandler(contributionController.deleteContribution));

export { router as contributionRoutes };
