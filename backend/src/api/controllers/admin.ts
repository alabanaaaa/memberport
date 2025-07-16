import { Request, Response } from 'express';

export const adminController = {
  async getDashboard(req: Request, res: Response) { res.json({ message: 'Get admin dashboard - TODO' }); },
  async getUsers(req: Request, res: Response) { res.json({ message: 'Get users - TODO' }); },
  async createUser(req: Request, res: Response) { res.json({ message: 'Create user - TODO' }); },
  async updateUser(req: Request, res: Response) { res.json({ message: 'Update user - TODO' }); },
  async deleteUser(req: Request, res: Response) { res.json({ message: 'Delete user - TODO' }); },
};
