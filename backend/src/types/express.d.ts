// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      username: string;
      displayName: string;
      avatar: string;
    };
  }
}
