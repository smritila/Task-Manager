import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLogo } from './app-logo';

interface AppShellProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
];

export function AppShell({ children, onLogout }: AppShellProps) {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[32px] border border-white/60 bg-white/80 px-5 py-4 shadow-glow backdrop-blur sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <AppLogo />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <nav
                aria-label="Primary navigation"
                className="flex flex-wrap items-center gap-2"
              >
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'rounded-full px-4 py-2 text-sm font-medium transition',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-secondary/80 text-foreground hover:bg-secondary',
                      ].join(' ')
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <Button variant="outline" onClick={onLogout} type="button">
                Logout
              </Button>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
