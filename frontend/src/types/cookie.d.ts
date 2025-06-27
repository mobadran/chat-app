type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none' | boolean; // boolean for true/false based on 'None'
  path?: string;
  expires?: Date;
  maxAge?: number; // In seconds
  domain?: string;
};
