import { NextFunction, Request, Response } from 'express';

export const suii = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('suii');
  } catch (error) {
    next(error);
  }
};
