import { NextFunction, Request, Response } from 'express';
import User from '#models/user.model.js';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.id === 'me') {
      const user = await User.findById(req.user!.id).select('username displayName');
      res.status(200).json(user);
      return;
    }
    const user = await User.findById(req.params.id).select('username displayName');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
