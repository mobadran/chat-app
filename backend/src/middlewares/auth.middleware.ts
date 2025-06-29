import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '#utils/jwt.utils.js';
import validator from '#validators/auth.validator.js';
import { ZodError } from 'zod';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No access token' });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    validator.TokenPayload.parse(payload);
    req.user = { id: payload.userId, username: payload.username };
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      res.status(403).json({ message: 'Token expired or invalid' });
    }
  }
};
