'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { parseAndFormatCookies } from './cookieUtils';

const API_URL = process.env.API_URL;

if (!API_URL) {
  console.error('Environment variable API_URL is not set.');
}

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  let redirectPath: string | null;
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/auth/login`,
      { email, password },
      { withCredentials: true }
    );

    if (response.status === 200) {
      const setCookieHeaders = response.headers['set-cookie'];
      const cookieStore = await cookies();

      if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
        const parsedCookies = parseAndFormatCookies(setCookieHeaders);
        parsedCookies.forEach((cookie) => {
          try {
            const cookieOptions: CookieOptions = {
              httpOnly: cookie.options.httpOnly || false,
              secure: cookie.options.secure || false,
              sameSite: cookie.options.sameSite || 'lax',
              path: cookie.options.path || '/',
            };

            if (cookie.options.expires) {
              cookieOptions.expires = new Date(cookie.options.expires);
            }
            if (cookie.options.maxAge) {
              cookieOptions.maxAge = cookie.options.maxAge;
            }

            cookieStore.set(cookie.name, cookie.value, cookieOptions);
            console.log(`[Next.js Server Action] Set cookie: ${cookie.name}`);
          } catch (cookieParseError) {
            console.error('Error parsing or setting cookie:', cookieParseError);
          }
        });
      }
      redirectPath = '/';
    } else {
      return { error: response.data?.message || 'Login failed.' };
    }
  } catch (error) {
    console.error('Login action error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          return { error: 'Invalid credentials.' };
        }
        return {
          error: `Login failed: Server responded with ${error.response.status}.`,
        };
      } else if (error.request) {
        return {
          error:
            'Login failed: No response from server. Is the backend running?',
        };
      }
    }
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }

  if (redirectPath) {
    redirect(redirectPath);
  }
}

export async function logout() {
  const cookieStore = await cookies();
  try {
    await axios.post(
      `${API_URL}/api/v1/auth/logout`,
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error('Logout action error:', error);
  } finally {
    cookieStore.set('authToken', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    redirect('/login');
  }
}

export async function getUserSession() {
  const cookieStore = await cookies();
  try {
    const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      withCredentials: true,
    });

    if (response.status === 200 && response.data?.user) {
      return {
        user: response.data.user,
        chatData: response.data.chatData || null,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user session from BFF:', error);
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      cookieStore.set('authToken', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    }
    return null;
  }
}
