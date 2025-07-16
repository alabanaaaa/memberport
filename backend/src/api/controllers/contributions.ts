import { Request, Response } from 'express';

export const contributionController = {
  async getContributions(req: Request, res: Response) {
    res.json({ message: 'Get contributions - TODO' });
  },
  async getContribution(req: Request, res: Response) {
    res.json({ message: 'Get contribution - TODO' });
  },
  async createContribution(req: Request, res: Response) {
    res.json({ message: 'Create contribution - TODO' });
  },
  async updateContribution(req: Request, res: Response) {
    res.json({ message: 'Update contribution - TODO' });
  },
  async deleteContribution(req: Request, res: Response) {
    res.json({ message: 'Delete contribution - TODO' });
  },
};
