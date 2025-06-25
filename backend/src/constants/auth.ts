export const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
export const ACCESS_TOKEN_TTL = 15 * 60 * 1000; // 15 minutes

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none' as const,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  path: '/api/v1/auth',
  maxAge: REFRESH_TOKEN_TTL,
};

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  path: '/',
  maxAge: ACCESS_TOKEN_TTL,
};
