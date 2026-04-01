import { Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AuthRequest } from './auth';

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Access denied. Admin only.' });
      return;
    }

    // Attach full user to req.user for convenience in admin routes if needed
    req.user = user;
    next();
  } catch (err) {
    console.error('requireAdmin error:', err);
    res.status(500).json({ error: 'Internal server error verifying admin status' });
  }
};
