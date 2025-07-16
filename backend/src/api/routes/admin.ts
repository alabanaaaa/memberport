import { Router } from 'express';
import { authenticate, adminOnly } from '@/api/middleware/auth';
import { asyncHandler } from '@/api/middleware/errorHandler';
import { adminController } from '@/api/controllers/admin';

const router = Router();

router.use(authenticate);
router.use(adminOnly);

router.get('/dashboard', asyncHandler(adminController.getDashboard));
router.get('/users', asyncHandler(adminController.getUsers));
router.post('/users', asyncHandler(adminController.createUser));
router.put('/users/:id', asyncHandler(adminController.updateUser));
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

export { router as adminRoutes };
