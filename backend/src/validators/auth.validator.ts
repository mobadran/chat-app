import { z } from 'zod';

const Register = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .max(32)
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?=^\S+$)./,
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and no spaces.',
      ),
  }),
});

const Login = z.object({
  body: z.object({
    email: z.string().email(),
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
