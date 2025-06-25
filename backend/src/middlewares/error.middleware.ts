import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '#constants/http-status-codes.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  res.status(INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred. Please try again later.' });
};

export default errorHandler;
