export const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
export const ACCESS_TOKEN_TTL = 15 * 60 * 1000; // 15 minutes
// Temporary 15 seconds access token for development
// export const ACCESS_TOKEN_TTL = 15 * 1000; // 15 seconds

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  path: '/',
  maxAge: REFRESH_TOKEN_TTL,
};
