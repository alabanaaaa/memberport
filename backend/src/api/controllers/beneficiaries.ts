import { Request, Response } from 'express';

export const beneficiaryController = {
  async getBeneficiaries(req: Request, res: Response) { res.json({ message: 'Get beneficiaries - TODO' }); },
  async getBeneficiary(req: Request, res: Response) { res.json({ message: 'Get beneficiary - TODO' }); },
  async createBeneficiary(req: Request, res: Response) { res.json({ message: 'Create beneficiary - TODO' }); },
  async updateBeneficiary(req: Request, res: Response) { res.json({ message: 'Update beneficiary - TODO' }); },
  async deleteBeneficiary(req: Request, res: Response) { res.json({ message: 'Delete beneficiary - TODO' }); },
};
