import { Router } from 'express';
import { authRoutes } from './auth';
import { memberRoutes } from './members';
import { contributionRoutes } from './contributions';
import { claimRoutes } from './claims';
import { beneficiaryRoutes } from './beneficiaries';
import { medicalRoutes } from './medical';
import { votingRoutes } from './voting';
import { auditRoutes } from './audit';
import { adminRoutes } from './admin';
import { uploadRoutes } from './upload';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/members', memberRoutes);
router.use('/contributions', contributionRoutes);
router.use('/claims', claimRoutes);
router.use('/beneficiaries', beneficiaryRoutes);
router.use('/medical', medicalRoutes);
router.use('/voting', votingRoutes);
router.use('/audit', auditRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

export { router as apiRoutes };
