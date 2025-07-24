import { NextFunction, Request, Response } from 'express';
import User from '#models/user.model.js';
import { uploadAvatar } from '#lib/supabase.js';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.id === 'me') {
      const user = await User.findById(req.user!.id).select('username displayName avatar');
      res.status(200).json(user);
      return;
    }
    const user = await User.findById(req.params.id).select('username displayName avatar');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No image uploaded' });
      return;
    }

    const avatarUrl = await uploadAvatar(file, req.user!.id, req.user!.avatar).catch((error) => {
      if (error.cause === 'invalid-image-type') {
        res.status(400).json({ error: 'Invalid image type. Only JPEG, PNG, and WEBP are allowed.' });
        return null;
      }
    });
    if (!avatarUrl) {
      return;
    }
    await User.findByIdAndUpdate(req.user!.id, { avatar: avatarUrl });

    res.status(200).json({ message: 'Avatar updated successfully', avatarUrl });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { displayName } = req.body;
    await User.findByIdAndUpdate(req.user!.id, { displayName });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};
