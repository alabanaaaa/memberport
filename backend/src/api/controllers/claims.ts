import { Request, Response } from 'express';

export const claimController = {
  async getClaims(req: Request, res: Response) { res.json({ message: 'Get claims - TODO' }); },
  async getClaim(req: Request, res: Response) { res.json({ message: 'Get claim - TODO' }); },
  async createClaim(req: Request, res: Response) { res.json({ message: 'Create claim - TODO' }); },
  async updateClaim(req: Request, res: Response) { res.json({ message: 'Update claim - TODO' }); },
  async deleteClaim(req: Request, res: Response) { res.json({ message: 'Delete claim - TODO' }); },
};
