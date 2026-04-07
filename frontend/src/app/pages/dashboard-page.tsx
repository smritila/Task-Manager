import { useEffect, useMemo, useState, type FormEvent } from 'react';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/features/auth/auth-context';
import { createTask, deleteTask, getTasks, updateTask } from '@/features/tasks/task-api';
import type { CreateTaskValues, Task, TaskStatus } from '@/features/tasks/types';
import { ApiError } from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/date';

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Completed' },
];

const filterOptions: Array<{ value: 'all' | TaskStatus; label: string }> = [
  { value: 'all', label: 'All tasks' },
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Completed' },
];

const defaultTaskValues: CreateTaskValues = {
  title: '',
  description: '',
  status: 'todo',
  startDateTime: '',
  endDateTime: '',
};

function getStatusLabel(status: TaskStatus) {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

function getStatusPillClassName(status: TaskStatus) {
  switch (status) {
    case 'todo':
      return 'bg-secondary text-secondary-foreground';
    case 'in_progress':
      return 'bg-primary/10 text-primary';
    case 'done':
      return 'bg-emerald-100 text-emerald-700';
  }
}

export function DashboardPage() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [taskActionMessage, setTaskActionMessage] = useState<string | null>(null);
  const [taskActionError, setTaskActionError] = useState<string | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreateTaskSheetOpen, setIsCreateTaskSheetOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | TaskStatus>('all');
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState(defaultTaskValues);

  async function loadTasks() {
    setIsLoadingTasks(true);
    setTasksError(null);

    try {
      const response = await getTasks();
      setTasks(response.tasks);
    } catch (error) {
      setTasksError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load your tasks right now. Please try again.',
      );
    } finally {
      setIsLoadingTasks(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  const taskStats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 'todo').length,
      inProgress: tasks.filter((task) => task.status === 'in_progress').length,
      done: tasks.filter((task) => task.status === 'done').length,
    }),
    [tasks],
  );

  const visibleTasks = useMemo(() => {
    if (activeFilter === 'all') {
      return tasks;
    }

    return tasks.filter((task) => task.status === activeFilter);
  }, [activeFilter, tasks]);

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTaskActionError(null);
    setTaskActionMessage(null);
    setIsCreatingTask(true);

    try {
      const response = await createTask({
        title: formValues.title.trim(),
        description: formValues.description?.trim() || undefined,
        status: formValues.status,
        startDateTime: formValues.startDateTime || undefined,
        endDateTime: formValues.endDateTime || undefined,
      });

      setTasks((current) => [response.task, ...current]);
      setFormValues(defaultTaskValues);
      setTaskActionMessage('Task created successfully.');
      setIsCreateTaskSheetOpen(false);
    } catch (error) {
      setTaskActionError(
        error instanceof ApiError
          ? error.message
          : 'Unable to create the task right now. Please try again.',
      );
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function handleStatusChange(taskId: number, status: TaskStatus) {
    setUpdatingTaskId(taskId);
    setTaskActionError(null);
    setTaskActionMessage(null);

    try {
      const response = await updateTask(taskId, { status });
      setTasks((current) =>
        current.map((task) => (task.id === taskId ? response.task : task)),
      );
      setTaskActionMessage('Task status updated.');
    } catch (error) {
      setTaskActionError(
        error instanceof ApiError
          ? error.message
          : 'Unable to update the task status right now.',
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(taskId: number) {
    setDeletingTaskId(taskId);
    setTaskActionError(null);
    setTaskActionMessage(null);

    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      setTaskActionMessage('Task deleted successfully.');
    } catch (error) {
      setTaskActionError(
        error instanceof ApiError
          ? error.message
          : 'Unable to delete the task right now.',
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  return (
    <>
      <AppShell onLogout={logout}>
        <main className="flex flex-col gap-6">
          <section className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Total tasks
                  </p>
                  <CardTitle className="text-4xl">{taskStats.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    To do
                  </p>
                  <CardTitle className="text-4xl">{taskStats.todo}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    In progress
                  </p>
                  <CardTitle className="text-4xl">{taskStats.inProgress}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Completed
                  </p>
                  <CardTitle className="text-4xl">{taskStats.done}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-primary">
                    Task Board
                  </p>
                  <CardTitle>Keep work moving with clear status ownership</CardTitle>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="min-w-44">
                    <Label className="sr-only" htmlFor="task-filter">
                      Filter tasks by status
                    </Label>
                    <select
                      id="task-filter"
                      className="flex h-11 w-full rounded-full border border-input bg-white/90 px-4 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      value={activeFilter}
                      onChange={(event) =>
                        setActiveFilter(event.target.value as 'all' | TaskStatus)
                      }
                    >
                      {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="button" onClick={() => setIsCreateTaskSheetOpen(true)}>
                    Create Task
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {taskActionMessage ? <Alert tone="success">{taskActionMessage}</Alert> : null}
                {!isCreateTaskSheetOpen && taskActionError ? (
                  <Alert tone="destructive">{taskActionError}</Alert>
                ) : null}

                {tasksError ? (
                  <Alert tone="destructive">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <span>{tasksError}</span>
                      <Button onClick={() => void loadTasks()} size="sm" type="button" variant="outline">
                        Retry
                      </Button>
                    </div>
                  </Alert>
                ) : null}

                {isLoadingTasks ? (
                  <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-8 text-sm text-muted-foreground">
                    Loading your task list and current status counts...
                  </div>
                ) : null}

                {!isLoadingTasks && !tasksError && visibleTasks.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-8">
                    <h3 className="text-lg font-semibold">Nothing here yet</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {tasks.length === 0
                        ? 'Create your first task from the Create Task button to start building momentum.'
                        : 'No tasks match the current status filter. Choose a different filter to explore the rest of your work.'}
                    </p>
                  </div>
                ) : null}

                {!isLoadingTasks && !tasksError && visibleTasks.length > 0 ? (
                  <div className="space-y-4">
                    {visibleTasks.map((task) => (
                      <article
                        key={task.id}
                        className="rounded-[28px] border border-border/80 bg-white/80 p-5 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-semibold">{task.title}</h3>
                              <span
                                className={[
                                  'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
                                  getStatusPillClassName(task.status),
                                ].join(' ')}
                              >
                                {getStatusLabel(task.status)}
                              </span>
                            </div>

                            <p className="text-sm leading-6 text-muted-foreground">
                              {task.description?.trim() || 'No description provided for this task.'}
                            </p>

                            <dl className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                              <div>
                                <dt className="font-medium text-foreground">Created</dt>
                                <dd>{formatDate(task.createdAt)}</dd>
                              </div>
                              <div>
                                <dt className="font-medium text-foreground">Starts</dt>
                                <dd>{formatDateTime(task.startDateTime)}</dd>
                              </div>
                              <div>
                                <dt className="font-medium text-foreground">Ends</dt>
                                <dd>{formatDateTime(task.endDateTime)}</dd>
                              </div>
                            </dl>
                          </div>

                          <div className="flex flex-col gap-3 sm:min-w-52">
                            <select
                              aria-label={`Update status for ${task.title}`}
                              className="flex h-11 w-full rounded-2xl border border-input bg-white/90 px-4 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              disabled={updatingTaskId === task.id}
                              value={task.status}
                              onChange={(event) =>
                                void handleStatusChange(
                                  task.id,
                                  event.target.value as TaskStatus,
                                )
                              }
                            >
                              {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>

                            <Button
                              disabled={deletingTaskId === task.id}
                              onClick={() => void handleDeleteTask(task.id)}
                              type="button"
                              variant="outline"
                            >
                              {deletingTaskId === task.id ? 'Deleting...' : 'Delete task'}
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </section>
        </main>
      </AppShell>

      <Sheet open={isCreateTaskSheetOpen} onOpenChange={setIsCreateTaskSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              Create Task
            </p>
            <SheetTitle>Capture your next piece of work</SheetTitle>
            <SheetDescription>
              Add a title, set the first status, and optionally schedule when it
              should start or finish.
            </SheetDescription>
          </SheetHeader>

          <form className="flex flex-1 flex-col" onSubmit={handleCreateTask}>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task title</Label>
                <Input
                  id="task-title"
                  value={formValues.title}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Prepare sprint planning notes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={formValues.description}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Add any context that will make this easier to finish later."
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="task-status">Initial status</Label>
                  <select
                    id="task-status"
                    className="flex h-11 w-full rounded-2xl border border-input bg-white/90 px-4 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    value={formValues.status}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        status: event.target.value as TaskStatus,
                      }))
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-start">Start date & time</Label>
                  <Input
                    id="task-start"
                    type="datetime-local"
                    value={formValues.startDateTime}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        startDateTime: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-end">End date & time</Label>
                <Input
                  id="task-end"
                  type="datetime-local"
                  value={formValues.endDateTime}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      endDateTime: event.target.value,
                    }))
                  }
                />
              </div>

              {taskActionError ? <Alert tone="destructive">{taskActionError}</Alert> : null}
            </div>

            <SheetFooter>
              <Button className="w-full sm:w-auto" disabled={isCreatingTask} type="submit">
                {isCreatingTask ? 'Creating task...' : 'Create task'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
