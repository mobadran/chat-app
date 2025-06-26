import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import csrf from 'csurf';
import errorHandler from '#middlewares/error.middleware.js';
import { FORBIDDEN } from '#constants/http-status-codes.js';
import authRoutes from '#routes/auth.routes.js';
import usersRoutes from '#routes/users.routes.js';
import conversationsRoutes from '#routes/conversations.routes.js';
import messagesRoutes from '#routes/messages.routes.js';

configDotenv();

const app = express();

// Core Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// CSRF Protection
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

// Routes
app.get('/api/v1/csrf-token', csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/v1', authRoutes);
app.use('/api/v1', usersRoutes);
app.use('/api/v1', conversationsRoutes);
app.use('/api/v1', messagesRoutes);

// Error Handling Middlewares
// CSRF error handler
app.use((err: Error & { code?: string }, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(FORBIDDEN).json({ error: 'Invalid CSRF Token' });
  } else {
    next(err);
  }
});

// Global error handler
app.use(errorHandler);

export default app;
