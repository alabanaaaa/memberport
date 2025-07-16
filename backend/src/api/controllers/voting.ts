import { Request, Response } from 'express';

export const votingController = {
  async getVotingEvents(req: Request, res: Response) { res.json({ message: 'Get voting events - TODO' }); },
  async getVotingEvent(req: Request, res: Response) { res.json({ message: 'Get voting event - TODO' }); },
  async createVotingEvent(req: Request, res: Response) { res.json({ message: 'Create voting event - TODO' }); },
  async updateVotingEvent(req: Request, res: Response) { res.json({ message: 'Update voting event - TODO' }); },
  async deleteVotingEvent(req: Request, res: Response) { res.json({ message: 'Delete voting event - TODO' }); },
  async castVote(req: Request, res: Response) { res.json({ message: 'Cast vote - TODO' }); },
};
