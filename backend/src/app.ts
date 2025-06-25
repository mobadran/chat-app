import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import csrf from 'csurf';
import authRoutes from '#routes/auth.routes.js';

configDotenv();

const app = express();

app.use(express.json());
app.use(cookieParser());

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
  },
});

const csrfExcludedPaths = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh'];

app.use((req: Request, res: Response, next: NextFunction) => {
  if (csrfExcludedPaths.includes(req.path)) {
    return next();
  }
  csrfProtection(req, res, next);
});

app.get('/api/v1/csrf-token', csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/v1/auth', authRoutes);

// CSRF error handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF Token' });
  }
  return next(err);
}) as express.ErrorRequestHandler);

// General error handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use(((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
}) as express.ErrorRequestHandler);

export default app;
