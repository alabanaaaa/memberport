import { Router } from 'express';
import { authenticate, adminOnly } from '@/api/middleware/auth';
import { asyncHandler } from '@/api/middleware/errorHandler';
import { auditController } from '@/api/controllers/audit';

const router = Router();

router.use(authenticate);
router.use(adminOnly);

router.get('/', asyncHandler(auditController.getAuditLogs));
router.get('/:id', asyncHandler(auditController.getAuditLog));

export { router as auditRoutes };
