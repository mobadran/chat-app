import axios from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/notifications';

export default function Login() {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  async function sendFormData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setButtonDisabled(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/v1/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        toast.success('Signed in successfully');
        navigate(from, { replace: true });
        return;
      }
    } catch (error) {
      toast.error('Sign in failed', { description: getErrorMessage(error, 'Check your credentials and try again.') });
    } finally {
      setButtonDisabled(false);
    }
  }

  return (
    <main className="flex h-screen items-center justify-center p-4">
      <form
        onSubmit={sendFormData}
        onChange={() => {
          if (formRef.current?.checkValidity()) {
            setButtonDisabled(false);
          }
        }}
        ref={formRef}
        method="POST"
        className="bg-accent form flex w-full max-w-100 flex-col items-stretch gap-4 rounded-lg p-4"
      >
        <h1 className="text-center text-2xl font-bold">Login</h1>
        <Input
          type="text"
          name="email"
          placeholder="Email/Username"
          title="Enter your email address or username"
          required
        />

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
        <Button type="submit" disabled={buttonDisabled}>
          Login
        </Button>
        <span>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary underline">
            Register
          </Link>
        </span>
      </form>
    </main>
  );
}
