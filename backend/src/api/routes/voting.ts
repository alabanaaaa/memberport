import { Router } from 'express';
import { authenticate, adminOnly } from '@/api/middleware/auth';
import { asyncHandler } from '@/api/middleware/errorHandler';
import { votingController } from '@/api/controllers/voting';

const router = Router();

router.use(authenticate);

router.get('/', authenticate, asyncHandler(votingController.getVotingEvents));
router.get('/:id', authenticate, asyncHandler(votingController.getVotingEvent));
router.post('/', adminOnly, asyncHandler(votingController.createVotingEvent));
router.put('/:id', adminOnly, asyncHandler(votingController.updateVotingEvent));
router.delete('/:id', adminOnly, asyncHandler(votingController.deleteVotingEvent));
router.post('/:id/vote', authenticate, asyncHandler(votingController.castVote));

export { router as votingRoutes };
