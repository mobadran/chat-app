import { z } from 'zod';

const Register = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .max(32)
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])[^\s]{8,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and no spaces.',
      ),
    username: z
      .string()
      .min(3)
      .max(32)
      .regex(/^[a-z0-9_]+$/),
    displayName: z.string().min(3).max(32).optional(),
  }),
});

const Login = z.object({
  body: z.object({
    email: z
      .string()
      .email()
      .or(z.string().regex(/^[a-z0-9_]+$/)),
    password: z.string(),
  }),
});

const Refresh = z.object({
  cookies: z.object({
    refreshToken: z.string(),
    deviceId: z.string(),
  }),
});

const TokenPayload = z.object({
  userId: z.string(),
});

export default { Register, Login, TokenPayload, Refresh };
