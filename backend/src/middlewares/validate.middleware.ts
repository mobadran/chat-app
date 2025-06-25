import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      cookies: req.cookies,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Validation failed', errors: error.errors });
    } else {
      next(error);
    }
  }
};

export default validate;
