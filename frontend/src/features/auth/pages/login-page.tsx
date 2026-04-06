import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';
import { login } from '../auth-api';
import { useAuth } from '../auth-context';
import { AuthShell } from '../components/auth-shell';
import type { LoginFormValues } from '../types';

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const [values, setValues] = useState(defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const successMessage =
    location.state && typeof location.state === 'object' && 'message' in location.state
      ? String(location.state.message)
      : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      setSession(response.accessToken, response.user);
      navigate('/dashboard', { replace: true });
    } catch (submissionError) {
      setError(
        submissionError instanceof ApiError
          ? submissionError.message
          : 'Unable to sign in right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign in to your account"
      description="Use the credentials tied to your Task Manager account to continue."
      footerText="Need an account?"
      footerLinkLabel="Create one"
      footerLinkTo="/register"
    >
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Keep your day moving with quick access to your dashboard and tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {successMessage ? (
              <Alert tone="success">{successMessage}</Alert>
            ) : null}

            {error ? <Alert tone="destructive">{error}</Alert> : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-xs font-medium text-primary transition hover:text-primary/80"
                  to="/register"
                >
                  Need a new account?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={values.password}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                required
              />
            </div>

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
