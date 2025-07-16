import { Request, Response } from 'express';

export const medicalController = {
  async getMedicalRecords(req: Request, res: Response) { res.json({ message: 'Get medical records - TODO' }); },
  async getMedicalRecord(req: Request, res: Response) { res.json({ message: 'Get medical record - TODO' }); },
  async createMedicalRecord(req: Request, res: Response) { res.json({ message: 'Create medical record - TODO' }); },
  async updateMedicalRecord(req: Request, res: Response) { res.json({ message: 'Update medical record - TODO' }); },
  async deleteMedicalRecord(req: Request, res: Response) { res.json({ message: 'Delete medical record - TODO' }); },
};
