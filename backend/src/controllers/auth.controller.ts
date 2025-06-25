import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '#models/user.model.js';
import { generateAccessToken } from '#utils/jwt.utils.js';
import validator from '#validators/auth.validator.js';
import { ZodError } from 'zod/v4';
import RefreshToken from '#models/refreshToken.model.js';
import { v4 as uuidv4 } from 'uuid';

const refreshTokenTTL = 7 * 24 * 60 * 60 * 1000;

export const register = async (req: Request, res: Response) => {
  try {
    validator.Register.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Invalid cookies', error: error.issues });
    } else {
      throw error;
    }
    return;
  }
  const { email, password } = req.body;

  // Check if user exist
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ email, hashedPassword });

  // Generate deviceId
  const deviceId = uuidv4();
  // Generate refresh token
  const refreshToken = uuidv4();
  await RefreshToken.create({ userId: user._id, token: refreshToken, deviceId });

  // Generate access token
  const accessToken = generateAccessToken(user._id.toString());

  // Give the deviceId to the client
  res.cookie('deviceId', deviceId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none' });

  // Send both in cookies
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/api/v1/auth',
    maxAge: refreshTokenTTL,
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
    maxAge: refreshTokenTTL,
  });

  // Send confirmation
  res.status(201).json({ message: 'User created' });
};

export const login = async (req: Request, res: Response) => {
  try {
    validator.Login.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Invalid request body', error: error.issues });
    }
    return;
  }
  const { email, password } = req.body;

  // Check if user exist
  const user = (await User.findOne({ email })) as IUser;
  if (!user) {
    // Simulate bcrypt.compare to prevent timing attack
    await bcrypt.compare(password, 'dsa120j0jcs091j98123921js9dskj12k3o123213213');
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  // Check if password match
  const isMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!isMatch) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = uuidv4();

  // Get deviceId
  let deviceId = req.cookies.deviceId;

  if (!deviceId) {
    deviceId = uuidv4(); // Generate a unique deviceId for this device
    res.cookie('deviceId', deviceId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none' });
  }

  // Remove old token for this device if exists
  await RefreshToken.updateMany({ userId: user._id, deviceId, invalidatedAt: null }, { $set: { invalidatedAt: new Date() } });

  // Store refreshToken in DB
  await RefreshToken.create({ userId: user._id, deviceId, token: refreshToken });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/api/v1/auth',
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
  });

  res.json({ message: 'Login successful' });
};

export const refresh = async (req: Request, res: Response) => {
  try {
    validator.Refresh.parse(req.cookies);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Invalid request body', error: error.issues });
    }
    return;
  }
  const { refreshToken, deviceId } = req.cookies;
  if (!refreshToken || !deviceId) {
    res.status(400).json({ message: 'Missing cookies' });
    return;
  }

  const existingRefreshToken = await RefreshToken.findOne({ token: refreshToken, deviceId });
  if (!existingRefreshToken) {
    res.status(403).json({ message: 'Invalid refresh token or reused by an attacker' });
    return;
  }

  if (Date.now() - existingRefreshToken.createdAt.getTime() > refreshTokenTTL) {
    res.status(403).json({ message: 'Refresh token expired' });
    return;
  }

  if (existingRefreshToken.invalidatedAt) {
    await RefreshToken.updateMany({ userId: existingRefreshToken.userId }, { $set: { invalidatedAt: new Date() } });

    console.log('SOMEONE ELSE USED THIS REFRESH TOKEN', existingRefreshToken);
    res.status(403).json({ message: 'Invalid refresh token or reused by an attacker' });
    return;
  }

  const newAccessToken = generateAccessToken(existingRefreshToken.userId.toString());
  const newRefreshToken = uuidv4();

  // Invalidate old token and create new one
  existingRefreshToken.invalidatedAt = new Date();
  await existingRefreshToken.save();
  await RefreshToken.create({
    userId: existingRefreshToken.userId,
    deviceId,
    token: newRefreshToken,
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/api/v1/auth',
  });
  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
  });

  res.json({ message: 'Refresh successful' });
};

export const logout = async (req: Request, res: Response) => {
  try {
    validator.Refresh.parse(req.cookies);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Invalid request body', error: error.issues });
    } else {
      throw error;
    }
    return;
  }
  const { refreshToken, deviceId } = req.cookies;
  if (!refreshToken || !deviceId) {
    res.status(400).json({ message: 'Missing cookies' });
    return;
  }

  if (refreshToken) {
    await RefreshToken.updateMany(
      { token: refreshToken, deviceId },
      {
        $set: {
          invalidatedAt: new Date(),
        },
      },
    );
  }

  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('deviceId');
  res.json({ message: 'Logged out successfully' });
};
