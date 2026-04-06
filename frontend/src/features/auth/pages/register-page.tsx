import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { register } from '../auth-api';
import { AuthShell } from '../components/auth-shell';
import type { RegisterFormValues } from '../types';

const defaultValues: RegisterFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const passwordHint =
  'Use at least 8 characters with one uppercase letter, one lowercase letter, and one number.';

export function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      navigate('/login', {
        replace: true,
        state: {
          message: 'Registration successful. Sign in with your new account.',
        },
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof ApiError
          ? submissionError.message
          : 'Unable to create your account right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Get Started"
      title="Create your account"
      description="Set up your Task Manager workspace with a quick, secure registration flow."
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkTo="/login"
    >
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Start with your basic details now and connect profile and task data
            next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error ? <Alert tone="destructive">{error}</Alert> : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Smriti"
                  value={values.firstName}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      firstName: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Patel"
                  value={values.lastName}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      lastName: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email address</Label>
              <Input
                id="register-email"
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
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={values.password}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                minLength={8}
                required
              />
              <p className="text-xs leading-5 text-muted-foreground">
                {passwordHint}
              </p>
            </div>

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
