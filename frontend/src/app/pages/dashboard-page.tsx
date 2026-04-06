import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/auth-context';

export function DashboardPage() {
  const { logout, user } = useAuth();

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Welcome back, {user?.firstName ?? 'there'}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your frontend auth routes are wired up. Next we can connect tasks,
              profile data, and protected API flows.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Next step placeholder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>This protected route confirms the basic login flow is working.</p>
            <p>
              Once the backend profile and task endpoints are ready, this page
              can become the real dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
