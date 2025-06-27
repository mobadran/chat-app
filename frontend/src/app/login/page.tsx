'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/actions';
import Link from 'next/link';
import { useActionState } from 'react';

export default function Login() {
  const initialState = { error: null };
  const [state, formAction] = useActionState(login, initialState);
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="mx-6 w-150 rounded-lg bg-white/10 p-6 shadow-lg shadow-white/5">
        <h1 className="mb-2 text-center text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mb-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
        <form className="flex flex-col gap-3" action={formAction}>
          <Input type="text" placeholder="Email or username" name="email" />
          <Input type="password" placeholder="Password" name="password" />
          {state?.error && (
            <p style={{ color: 'red', marginTop: '10px' }}>{state.error}</p>
          )}
          <Button type="submit" className="mt-2">
            Login
          </Button>
        </form>
      </div>
    </main>
  );
}
