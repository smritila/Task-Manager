export function AppLogo() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
        TM
      </div>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
          Task Manager
        </p>
        <p className="text-sm text-muted-foreground">
          Clear work. Calm flow. Better follow-through.
        </p>
      </div>
    </div>
  );
}
