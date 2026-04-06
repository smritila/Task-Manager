import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/auth-context';
import { LoginPage } from '@/features/auth/pages/login-page';
import { RegisterPage } from '@/features/auth/pages/register-page';
import { DashboardPage } from './pages/dashboard-page';
import { ProfilePage } from './pages/profile-page';

function FullScreenStatus({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          {description}
        </CardContent>
      </Card>
    </main>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <FullScreenStatus
        title="Preparing your workspace"
        description="We’re validating your session and loading your account."
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <FullScreenStatus
        title="Checking your session"
        description="Hang tight while we determine where to send you next."
      />
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/login" />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to="/login" />,
  },
]);
