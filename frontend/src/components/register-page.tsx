import ErrorDialog from '@/components/error-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import axios from '@/api/axios';

export default function Register() {
  const [disabled, setDisabled] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  async function sendFormData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDisabled(true);
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const displayName = formData.get('displayName');

    try {
      const response = await axios.post(
        '/api/v1/auth/register',
        {
          username,
          email,
          password,
          displayName,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 201) {
        navigate('/');
        return;
      }

      showErrorMessage(response.data.message);
      // eslint-disable-next-line
    } catch (err: any) {
      showErrorMessage(err.response.data.message);
    } finally {
      setDisabled(false);
    }
  }

  function showErrorMessage(message: string) {
    setOpen(true);
    setErrorMessage(message);
  }

  return (
    <main className="flex h-screen items-center justify-center p-4">
      <form
        onSubmit={sendFormData}
        onChange={() => {
          if (formRef.current?.checkValidity()) {
            setDisabled(false);
          }
        }}
        ref={formRef}
        method="POST"
        className="bg-accent form flex w-full max-w-100 flex-col items-stretch gap-4 rounded-lg p-4"
      >
        <h1 className="text-center text-2xl font-bold">Register</h1>
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
        <p>Username must be 3~32 characters long and contain only letters, numbers, or underscores</p>
        <Input type="email" name="email" placeholder="Email" title="Please enter a valid email address" required />

        <p>Please enter a valid email address</p>
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
        <p>Display name must be 3~32 characters long</p>
        <Button type="submit" disabled={disabled}>
          Register
        </Button>
        <span>
          Already have an account?{' '}
          <Link to="/login" className="text-primary underline">
            Login
          </Link>
        </span>
      </form>
      <ErrorDialog message={errorMessage} open={open} onOpenChange={setOpen} />
    </main>
  );
}
