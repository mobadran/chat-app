import { z } from 'zod/v4';

const Register = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8)
    .max(32)
    .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?=^\S+$)./),
});

const Login = z.object({
  email: z.email(),
  password: z.string(),
});

const TokenPayload = z.object({
  userId: z.string(),
});

const Refresh = z.object({
  refreshToken: z.string(),
  deviceId: z.string(),
});

export default { Register, Login, TokenPayload, Refresh };
