import { Request, Response } from 'express';

export const auditController = {
  async getAuditLogs(req: Request, res: Response) { res.json({ message: 'Get audit logs - TODO' }); },
  async getAuditLog(req: Request, res: Response) { res.json({ message: 'Get audit log - TODO' }); },
};
