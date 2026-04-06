import { useEffect, useState, type FormEvent } from 'react';
import { AppShell } from '@/components/shared/app-shell';
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
import { getCurrentUser, updateCurrentUser } from '@/features/auth/auth-api';
import { useAuth } from '@/features/auth/auth-context';
import type { AuthUser } from '@/features/auth/types';
import { ApiError } from '@/lib/api';
import { formatDate } from '@/lib/date';

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

function getDefaultValues(user: AuthUser | null): ProfileFormValues {
  return {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
  };
}

export function ProfilePage() {
  const { logout, updateUser, user } = useAuth();
  const [values, setValues] = useState<ProfileFormValues>(() =>
    getDefaultValues(user),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setValues(getDefaultValues(user));
  }, [user]);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getCurrentUser();
        updateUser(response.user);
        setValues(getDefaultValues(response.user));
      } catch (loadError) {
        setError(
          loadError instanceof ApiError
            ? loadError.message
            : 'Unable to load your profile details right now.',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [updateUser]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const response = await updateCurrentUser({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim() || null,
      });

      updateUser(response.user);
      setValues(getDefaultValues(response.user));
      setSuccessMessage('Profile updated successfully.');
    } catch (saveError) {
      setError(
        saveError instanceof ApiError
          ? saveError.message
          : 'Unable to update your profile right now.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell onLogout={logout}>
      <main className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(249,115,22,0.16))]">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              Profile
            </p>
            <CardTitle className="text-3xl">
              {user?.firstName} {user?.lastName}
            </CardTitle>
            <CardDescription>
              Keep your account details accurate and easy to recognize across the
              workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Email address
              </p>
              <p className="mt-1 text-sm font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Registration date
              </p>
              <p className="mt-1 text-sm font-medium">
                {formatDate(user?.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Last updated
              </p>
              <p className="mt-1 text-sm font-medium">
                {formatDate(user?.updatedAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              Edit Details
            </p>
            <CardTitle>Update your profile information</CardTitle>
            <CardDescription>
              First name and last name are editable here, while the email remains
              visible for reference from the backend profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-8 text-sm text-muted-foreground">
                Loading your profile details...
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profile-first-name">First name</Label>
                    <Input
                      id="profile-first-name"
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
                    <Label htmlFor="profile-last-name">Last name</Label>
                    <Input
                      id="profile-last-name"
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
                  <Label htmlFor="profile-email">Email address</Label>
                  <Input
                    id="profile-email"
                    disabled
                    value={values.email}
                  />
                </div>

                {error ? <Alert tone="destructive">{error}</Alert> : null}
                {successMessage ? <Alert tone="success">{successMessage}</Alert> : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    disabled={isSaving}
                    type="submit"
                  >
                    {isSaving ? 'Saving changes...' : 'Save changes'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
