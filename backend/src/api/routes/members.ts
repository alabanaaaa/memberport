import { Router } from 'express';
import { authenticate, selfOrAdmin, adminOnly } from '@/api/middleware/auth';
import { asyncHandler } from '@/api/middleware/errorHandler';
import { memberController } from '@/api/controllers/members';

const router = Router();

// All member routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members (admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', adminOnly, asyncHandler(memberController.getMembers));

/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Get member by ID
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
router.get('/:id', selfOrAdmin, asyncHandler(memberController.getMember));

/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Update member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
router.put('/:id', selfOrAdmin, asyncHandler(memberController.updateMember));

/**
 * @swagger
 * /members/{id}/profile:
 *   get:
 *     summary: Get member profile
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member profile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
router.get('/:id/profile', selfOrAdmin, asyncHandler(memberController.getMemberProfile));

/**
 * @swagger
 * /members/{id}/dashboard:
 *   get:
 *     summary: Get member dashboard data
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member dashboard data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
router.get('/:id/dashboard', selfOrAdmin, asyncHandler(memberController.getMemberDashboard));

export { router as memberRoutes };
