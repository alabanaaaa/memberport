import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { createError } from '@/api/middleware/errorHandler';

export const memberController = {
  async getMembers(req: Request, res: Response) {
    const members = await prisma.member.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
    res.json({ members });
  },

  async getMember(req: Request, res: Response) {
    const { id } = req.params;
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        beneficiaries: true,
        contributions: true,
        claims: true,
      },
    });

    if (!member) {
      throw createError('Member not found', 404);
    }

    res.json({ member });
  },

  async updateMember(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;

    const member = await prisma.member.update({
      where: { id },
      data: updateData,
    });

    res.json({ member });
  },

  async getMemberProfile(req: Request, res: Response) {
    const { id } = req.params;
    // TODO: Implement member profile logic
    res.json({ message: 'Member profile retrieved' });
  },

  async getMemberDashboard(req: Request, res: Response) {
    const { id } = req.params;
    // TODO: Implement member dashboard logic
    res.json({ message: 'Member dashboard data retrieved' });
  },
};
