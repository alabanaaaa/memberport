import { Router } from 'express';
import { authenticate, selfOrAdmin, adminOnly } from '@/api/middleware/auth';
import { asyncHandler } from '@/api/middleware/errorHandler';
import { claimController } from '@/api/controllers/claims';

const router = Router();

// All claim routes require authentication
router.use(authenticate);

router.get('/', adminOnly, asyncHandler(claimController.getClaims));
router.get('/:id', selfOrAdmin, asyncHandler(claimController.getClaim));
router.post('/', authenticate, asyncHandler(claimController.createClaim));
router.put('/:id', adminOnly, asyncHandler(claimController.updateClaim));
router.delete('/:id', adminOnly, asyncHandler(claimController.deleteClaim));

export { router as claimRoutes };
