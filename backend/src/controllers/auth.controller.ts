import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User, { IUser } from '#models/user.model.js';
import RefreshToken from '#models/refreshToken.model.js';
import { generateAccessToken } from '#utils/jwt.utils.js';
import { BAD_REQUEST, CREATED, FORBIDDEN, OK } from '#constants/http-status-codes.js';
import { ACCESS_TOKEN_COOKIE_OPTIONS, COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_TTL } from '#constants/auth.js';
import { AUTH_MESSAGES } from '#constants/messages.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(BAD_REQUEST).json({ message: AUTH_MESSAGES.USER_EXISTS });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, hashedPassword });

    const deviceId = uuidv4();
    const refreshToken = uuidv4();
    await RefreshToken.create({ userId: user._id, token: refreshToken, deviceId });

    const accessToken = generateAccessToken(user._id.toString());

    res.cookie('deviceId', deviceId, COOKIE_OPTIONS);
    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, { ...ACCESS_TOKEN_COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_TTL });

    res.status(CREATED).json({ message: AUTH_MESSAGES.USER_CREATED });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as IUser;
    if (!user) {
      await bcrypt.compare(password, 'dsa120j0jcs091j98123921js9dskj12k3o123213213');
      res.status(BAD_REQUEST).json({ message: AUTH_MESSAGES.INVALID_CREDENTIALS });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      res.status(BAD_REQUEST).json({ message: AUTH_MESSAGES.INVALID_CREDENTIALS });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = uuidv4();

    let deviceId = req.cookies.deviceId;
    if (!deviceId) {
      deviceId = uuidv4();
      res.cookie('deviceId', deviceId, COOKIE_OPTIONS);
    }

    await RefreshToken.updateMany({ userId: user._id, deviceId, invalidatedAt: null }, { $set: { invalidatedAt: new Date() } });
    await RefreshToken.create({ userId: user._id, deviceId, token: refreshToken });

    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

    res.status(OK).json({ message: AUTH_MESSAGES.LOGIN_SUCCESS });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken, deviceId } = req.cookies;

    const existingRefreshToken = await RefreshToken.findOne({ token: refreshToken, deviceId });
    if (!existingRefreshToken) {
      res.status(FORBIDDEN).json({ message: AUTH_MESSAGES.INVALID_REFRESH_TOKEN });
      return;
    }

    if (Date.now() - existingRefreshToken.createdAt.getTime() > REFRESH_TOKEN_TTL) {
      res.status(FORBIDDEN).json({ message: AUTH_MESSAGES.INVALID_REFRESH_TOKEN });
      return;
    }

    if (existingRefreshToken.invalidatedAt) {
      await RefreshToken.updateMany({ userId: existingRefreshToken.userId }, { $set: { invalidatedAt: new Date() } });
      console.log('Potential refresh token reuse detected for user:', existingRefreshToken.userId);
      res.status(FORBIDDEN).json({ message: AUTH_MESSAGES.REUSED_REFRESH_TOKEN });
      return;
    }

    const newAccessToken = generateAccessToken(existingRefreshToken.userId.toString());
    const newRefreshToken = uuidv4();

    existingRefreshToken.invalidatedAt = new Date();
    await existingRefreshToken.save();
    await RefreshToken.create({
      userId: existingRefreshToken.userId,
      deviceId,
      token: newRefreshToken,
    });

    res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.cookie('accessToken', newAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

    res.status(OK).json({ message: AUTH_MESSAGES.REFRESH_SUCCESS });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken, deviceId } = req.cookies;

    if (refreshToken) {
      await RefreshToken.updateMany({ token: refreshToken, deviceId }, { $set: { invalidatedAt: new Date() } });
    }

    res.clearCookie('refreshToken', { path: REFRESH_TOKEN_COOKIE_OPTIONS.path });
    res.clearCookie('accessToken', { path: ACCESS_TOKEN_COOKIE_OPTIONS.path });
    res.clearCookie('deviceId');

    res.status(OK).json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS });
  } catch (error) {
    next(error);
  }
};
