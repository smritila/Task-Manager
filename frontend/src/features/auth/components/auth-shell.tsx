import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/shared/app-logo';

interface AuthShellProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.25),transparent_36%),linear-gradient(135deg,#083344,#164e63_48%,#0f766e)]" />
        <div className="absolute inset-x-10 bottom-10 h-56 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="relative z-10">
          <AppLogo />
        </div>
        <div className="relative z-10 max-w-xl space-y-6 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">
            {eyebrow}
          </p>
          <h1 className="text-5xl font-semibold leading-tight">
            Focus on the work that matters without losing the thread.
          </h1>
          <p className="max-w-lg text-base leading-7 text-white/78">
            A calm, structured task workspace for planning your day, tracking
            progress, and keeping account context in one place.
          </p>
          <div className="grid max-w-md grid-cols-2 gap-4 pt-4">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-3xl font-semibold">3x</p>
              <p className="mt-2 text-sm text-white/75">
                clearer daily priorities
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-3xl font-semibold">1 place</p>
              <p className="mt-2 text-sm text-white/75">
                for login, profile, and task flow
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="lg:hidden">
            <AppLogo />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>

          {children}

          <p className="text-center text-sm text-muted-foreground">
            {footerText}{' '}
            <Link
              className="font-semibold text-primary transition hover:text-primary/80"
              to={footerLinkTo}
            >
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
