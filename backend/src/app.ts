import express from 'express';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import errorHandler from '#middlewares/error.middleware.js';
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

app.use('/api/v1', authRoutes);
app.use('/api/v1', usersRoutes);
app.use('/api/v1', conversationsRoutes);
app.use('/api/v1', messagesRoutes);

// Error Handling Middlewares
app.use(errorHandler);

export default app;
