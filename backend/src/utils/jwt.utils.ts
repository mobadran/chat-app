import { ACCESS_TOKEN_TTL } from '#constants/auth.js';
import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';

configDotenv();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
if (!ACCESS_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET is not defined');
}
const ACCESS_EXPIRES_IN = ACCESS_TOKEN_TTL / 1000;

export const generateAccessToken = (userId: string, username: string, displayName: string, avatar: string) => {
  return jwt.sign({ userId, username, displayName, avatar }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as {
    userId: string;
    username: string;
    displayName: string;
    avatar: string;
  };
};
