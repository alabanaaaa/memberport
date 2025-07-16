import { Router } from 'express';
import { authenticate, selfOrAdmin } from '@/api/middleware/auth';
import { asyncHandler } from '@/api/middleware/errorHandler';
import { beneficiaryController } from '@/api/controllers/beneficiaries';

const router = Router();

router.use(authenticate);

router.get('/', selfOrAdmin, asyncHandler(beneficiaryController.getBeneficiaries));
router.get('/:id', selfOrAdmin, asyncHandler(beneficiaryController.getBeneficiary));
router.post('/', authenticate, asyncHandler(beneficiaryController.createBeneficiary));
router.put('/:id', selfOrAdmin, asyncHandler(beneficiaryController.updateBeneficiary));
router.delete('/:id', selfOrAdmin, asyncHandler(beneficiaryController.deleteBeneficiary));

export { router as beneficiaryRoutes };
