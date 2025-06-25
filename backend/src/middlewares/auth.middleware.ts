import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '#utils/jwt.utils.js';
import validator from '#vaildators/auth.validator.js';
import { ZodError } from 'zod';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ message: 'No access token' });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    validator.TokenPayload.parse(payload);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      res.status(403).json({ message: 'Token expired or invalid' });
    }
  }
};
