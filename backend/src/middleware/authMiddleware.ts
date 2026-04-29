import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    // Check blacklist before anything else
    const prismaAny = prisma as any;
    const blacklistModel = prismaAny.blacklistedToken ?? prismaAny.blacklistedTokens;
    const blacklisted = blacklistModel
      ? await blacklistModel.findUnique({ where: { token } })
      : null;
    if (blacklisted) return res.status(401).json({ error: 'Token has been invalidated. Please log in again.' });

    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

export default authenticateToken;