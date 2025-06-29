'use client';
import ErrorDialog from '@/components/error-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';
import { useRef, useState } from 'react';

export default function Register() {
  const [disabled, setDisabled] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function sendFormData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDisabled(true);
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const displayName = formData.get('displayName');

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        displayName,
      }),
    });

    if (response.status === 201) {
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
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          minLength={3}
          maxLength={32}
          pattern="^[a-z0-9_]+$"
          title="Username must be 3~32 characters long and contain only letters, numbers, or underscores"
          required
        />
        <p>
          Username must be 3~32 characters long and contain only letters, numbers, or underscores
        </p>
        <Input type="email" name="email" placeholder="Email" title="Please enter a valid email address" required />

        <p>
          Please enter a valid email address
        </p>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          minLength={8}
          maxLength={32}
          pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[^\s]{8,}$"
          title="Password must be 8~32 characters long and include at least one uppercase letter, one lowercase letter, one digit, one special character, and no spaces"
          required
        />
        <p>
          Password must be 8~32 characters long and include at least one uppercase letter, one lowercase letter, one
          digit, one special character, and no spaces
        </p>
        <Input
          type="text"
          name="displayName"
          pattern=".{3,32}"
          title="Display name must be 3~32 characters long"
          placeholder="Display Name (optional)"
        />
        <p>
          Display name must be 3~32 characters long
        </p>
        <Button type="submit" disabled={disabled}>
          Register
        </Button>
      </form>
      <ErrorDialog message={errorMessage} open={open} onOpenChange={setOpen} />
    </main>
  );
}
