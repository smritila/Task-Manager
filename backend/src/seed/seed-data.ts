export type SeedTaskStatus = 'todo' | 'in_progress' | 'done';

export interface SeedTask {
  title: string;
  description: string | null;
  status: SeedTaskStatus;
  createdAt: string;
  startDateTime?: string | null;
  endDateTime?: string | null;
}

export interface SeedUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tasks: SeedTask[];
}

const hoursAgo = (hours: number): string =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

export const seedUsers: SeedUser[] = [
  {
    firstName: 'Ava',
    lastName: 'Thompson',
    email: 'ava.thompson@example.com',
    password: 'Password123!',
    tasks: [
      {
        title: 'Finalize onboarding checklist',
        description:
          'Review outstanding setup steps for the new operations coordinator.',
        status: 'done',
        createdAt: hoursAgo(72),
        startDateTime: hoursAgo(70),
        endDateTime: hoursAgo(60),
      },
      {
        title: 'Prepare sprint planning notes',
        description:
          'Collect blockers, carry-over tasks, and product priorities for the next sprint.',
        status: 'in_progress',
        createdAt: hoursAgo(30),
        startDateTime: hoursAgo(26),
        endDateTime: null,
      },
      {
        title: 'Refine dashboard empty state copy',
        description:
          'Draft a friendlier message for users with no active tasks yet.',
        status: 'todo',
        createdAt: hoursAgo(10),
      },
      {
        title: 'Audit overdue task notifications',
        description:
          'Verify email wording and timing for stale tasks in the queue.',
        status: 'todo',
        createdAt: hoursAgo(4),
      },
    ],
  },
  {
    firstName: 'Marcus',
    lastName: 'Lee',
    email: 'marcus.lee@example.com',
    password: 'Password123!',
    tasks: [
      {
        title: 'Ship profile settings improvements',
        description:
          'Polish profile form validation and save-state feedback.',
        status: 'done',
        createdAt: hoursAgo(96),
        startDateTime: hoursAgo(90),
        endDateTime: hoursAgo(80),
      },
      {
        title: 'Investigate login retry errors',
        description:
          'Review recent auth failures reported by QA in the staging environment.',
        status: 'in_progress',
        createdAt: hoursAgo(18),
        startDateTime: hoursAgo(16),
        endDateTime: null,
      },
      {
        title: 'Write release notes draft',
        description: 'Summarize dashboard updates and auth bug fixes for the team.',
        status: 'in_progress',
        createdAt: hoursAgo(12),
        startDateTime: hoursAgo(11),
        endDateTime: null,
      },
      {
        title: 'Archive completed support requests',
        description:
          'Move resolved customer issues into the April reporting bucket.',
        status: 'todo',
        createdAt: hoursAgo(6),
      },
    ],
  },
  {
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@example.com',
    password: 'Password123!',
    tasks: [
      {
        title: 'Review analytics widget layout',
        description:
          'Check spacing and responsiveness for the dashboard metrics cards.',
        status: 'done',
        createdAt: hoursAgo(54),
        startDateTime: hoursAgo(50),
        endDateTime: hoursAgo(44),
      },
      {
        title: 'Map task filters to API query params',
        description:
          'Document how status filters should be represented in the backend contract.',
        status: 'done',
        createdAt: hoursAgo(42),
        startDateTime: hoursAgo(40),
        endDateTime: hoursAgo(36),
      },
      {
        title: 'Test mobile dashboard interactions',
        description:
          'Verify task status updates and delete actions on smaller screens.',
        status: 'in_progress',
        createdAt: hoursAgo(14),
        startDateTime: hoursAgo(13),
        endDateTime: null,
      },
      {
        title: 'Create Q2 planning task list',
        description:
          'Break larger roadmap items into manageable dashboard tasks.',
        status: 'todo',
        createdAt: hoursAgo(2),
      },
    ],
  },
];
