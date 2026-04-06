import * as React from 'react';
import { cn } from '@/lib/utils';

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: 'default' | 'destructive' | 'success';
};

const toneStyles: Record<NonNullable<AlertProps['tone']>, string> = {
  default: 'border-border bg-secondary/60 text-foreground',
  destructive: 'border-destructive/20 bg-destructive/10 text-destructive',
  success: 'border-primary/20 bg-primary/10 text-primary',
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone = 'default', ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm',
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  ),
);

Alert.displayName = 'Alert';

export { Alert };
