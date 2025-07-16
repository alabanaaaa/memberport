import { Router } from 'express';
import { authenticate, selfOrAdmin, adminOnly } from '@/api/middleware/auth';
import { asyncHandler } from '@/api/middleware/errorHandler';
import { medicalController } from '@/api/controllers/medical';

const router = Router();

router.use(authenticate);

router.get('/', adminOnly, asyncHandler(medicalController.getMedicalRecords));
router.get('/:id', selfOrAdmin, asyncHandler(medicalController.getMedicalRecord));
router.post('/', authenticate, asyncHandler(medicalController.createMedicalRecord));
router.put('/:id', adminOnly, asyncHandler(medicalController.updateMedicalRecord));
router.delete('/:id', adminOnly, asyncHandler(medicalController.deleteMedicalRecord));

export { router as medicalRoutes };
