import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User, { IUser } from '#models/user.model.js';
import RefreshToken from '#models/refreshToken.model.js';
import { generateAccessToken } from '#utils/jwt.utils.js';
import { CONFLICT, CREATED, FORBIDDEN, OK, UNAUTHORIZED } from '#constants/http-status-codes.js';
import { REFRESH_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_TTL } from '#constants/auth.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, username, displayName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(CONFLICT).json({ message: 'User with this email already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      hashedPassword,
      username,
      displayName: displayName || null,
    });

    const refreshToken = uuidv4();
    await RefreshToken.create({ userId: user._id, token: refreshToken });

    const accessToken = generateAccessToken(user._id.toString(), user.username, user.displayName, user.avatar);

    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(CREATED).json({ message: 'User created successfully.', accessToken });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ $or: [{ email }, { username: email }] }).select('+hashedPassword')) as IUser;
    if (!user) {
      // Fake compare to prevent timing attacks
      await bcrypt.compare(password, '$2b$12$PKkzH3hI7ahICMVp3q/.1uEWpVgvhBSbNjlRVTkD8M0UVVsC6G9Qm');
      res.status(UNAUTHORIZED).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      res.status(UNAUTHORIZED).json({ message: 'Invalid email or password.' });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString(), user.username, user.displayName, user.avatar);
    const refreshToken = uuidv4();

    // Invalidate all old refresh tokens
    // await RefreshToken.updateMany({ userId: user._id, invalidatedAt: null }, { $set: { invalidatedAt: new Date() } });
    await RefreshToken.create({ userId: user._id, token: refreshToken });

    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(OK).json({ message: 'Login successful.', accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    const existingRefreshToken = await RefreshToken.findOne({ token: refreshToken });
    if (!existingRefreshToken) {
      res.status(FORBIDDEN).json({ message: 'Invalid or expired refresh token.' });
      return;
    }

    const user = await User.findById(existingRefreshToken.userId);
    if (!user) {
      res.status(FORBIDDEN).json({ message: 'Invalid or expired refresh token.' });
      return;
    }

    if (Date.now() - existingRefreshToken.createdAt.getTime() > REFRESH_TOKEN_TTL) {
      res.status(FORBIDDEN).json({ message: 'Invalid or expired refresh token.' });
      return;
    }

    if (existingRefreshToken.invalidatedAt) {
      await RefreshToken.updateMany({ userId: existingRefreshToken.userId }, { $set: { invalidatedAt: new Date() } });
      console.log('Potential refresh token reuse detected for user:', existingRefreshToken.userId, refreshToken);
      res.status(FORBIDDEN).json({ message: 'Potential refresh token reuse detected.' });
      return;
    }

    const newAccessToken = generateAccessToken(existingRefreshToken.userId.toString(), user.username, user.displayName, user.avatar);
    const newRefreshToken = uuidv4();

    existingRefreshToken.invalidatedAt = new Date();
    await existingRefreshToken.save();
    await RefreshToken.create({
      userId: existingRefreshToken.userId,
      token: newRefreshToken,
    });

    res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(OK).json({
      message: 'Tokens refreshed successfully.',
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      // Invalidate the refresh token
      await RefreshToken.updateMany({ token: refreshToken }, { $set: { invalidatedAt: new Date() } });
    }
    // Clear cookies
    res.clearCookie('refreshToken', REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(OK).json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};
