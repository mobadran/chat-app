import axios from '@/api/axios';
import ErrorDialog from '@/components/error-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

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
        navigate(from, { replace: true });
        return;
      }

      showErrorMessage(response.data.message);
      // eslint-disable-next-line
    } catch (err: any) {
      showErrorMessage(err.response.data.message);
    } finally {
      setButtonDisabled(false);
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
      </form>
      <ErrorDialog message={errorMessage} open={open} onOpenChange={setOpen} />
    </main>
  );
}
