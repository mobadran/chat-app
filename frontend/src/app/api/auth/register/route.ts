import { NextResponse } from 'next/server';
import cookie from 'cookie'

export async function POST(request: Request) {
  try {
    const { email, password, username, displayName } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json({ message: 'Email, password and username are required' }, { status: 400 });
    }

    const backendUrl = `${process.env.BACKEND_URL}/api/v1/auth/register`;

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        username,
        displayName: displayName || undefined,
      }),
    });

    const data = await backendResponse.json();


    
    const res = NextResponse.json(data, { status: backendResponse.status });
    const cookies = backendResponse.headers.getSetCookie().map((string) => cookie.parse(string));
    res.cookies.set('refreshToken', cookies[1].refreshToken || cookies[0].refreshToken || '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.cookies.set('deviceId', cookies[1].deviceId || cookies[0].deviceId || '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
