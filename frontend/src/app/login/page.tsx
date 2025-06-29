'use client';
import ErrorDialog from '@/components/error-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';
import { useRef, useState } from 'react';

export default function Login() {
  const [disabled, setDisabled] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function sendFormData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDisabled(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      redirect('/');
    }

    const data = await response.json();
    showErrorMessage(data.message);
    setDisabled(false);
  }

  function showErrorMessage(message: string) {
    setOpen(true);
    setErrorMessage(message);
  }

  return (
    <main className="flex items-center justify-center h-screen p-4">
      <form
        onSubmit={sendFormData}
        onChange={() => {
          if (formRef.current?.checkValidity()) {
            setDisabled(false);
          }
        }}
        ref={formRef}
        method="POST"
        className="flex flex-col gap-4 p-4 rounded-lg bg-accent items-stretch w-full max-w-100 form"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <Input type="text" name="email" placeholder="Email/Username" title="Enter your email address or username" required />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          minLength={8}
          maxLength={32}
          pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[^\s]{8,}$"
          title="Enter your password"
          required
        />
        <Button type="submit" disabled={disabled}>
          Login
        </Button>
      </form>
      <ErrorDialog message={errorMessage} open={open} onOpenChange={setOpen} />
    </main>
  );
}
