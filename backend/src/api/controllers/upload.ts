import { Request, Response } from 'express';

export const uploadController = {
  async uploadDocument(req: Request, res: Response) { res.json({ message: 'Upload document - TODO' }); },
  async uploadImage(req: Request, res: Response) { res.json({ message: 'Upload image - TODO' }); },
  async getFile(req: Request, res: Response) { res.json({ message: 'Get file - TODO' }); },
  async deleteFile(req: Request, res: Response) { res.json({ message: 'Delete file - TODO' }); },
};
