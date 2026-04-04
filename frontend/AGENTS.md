# Frontend Agent Steering

## Frontend Goal

Build a React frontend for the Task Manager that feels polished, clear, and reliable.

The frontend should cover:

- Registration
- Login
- Profile view
- Dashboard
- Task creation
- Task listing
- Task status updates
- Task deletion
- At least one of:
  - filter by status
  - sort tasks
  - group tasks in simple Kanban-style columns

## Stack Direction

- React
- Tailwind CSS for styling utilities and layout
- `shadcn/ui` for composable UI components

This combination makes sense and is the preferred direction for this project.

## Frontend Architecture

Prefer a feature-aware structure, for example:

- `src/app` for app bootstrap, routing, providers
- `src/features/auth`
- `src/features/profile`
- `src/features/tasks`
- `src/components/ui` for generated `shadcn/ui` primitives
- `src/components/shared` for app-specific reusable components
- `src/lib` for API client, helpers, constants, utilities

Avoid putting all components, hooks, and API code into one flat folder.

## UI Principles

- Keep the interface clean and easy to scan
- Use consistent spacing and typography
- Favor calm, practical layouts over overly decorative ones
- Use cards, sections, headers, and actions consistently
- Make forms feel straightforward and forgiving

## UX Requirements

The UI must include:

- Loading states for page loads and async actions
- Empty states for task list and dashboard sections
- Error states for API failures
- Success feedback for key actions where helpful

Preferred feedback patterns:

- Inline form validation errors
- Toasts for create/update/delete/auth feedback
- Disabled buttons during submission

## API Integration Rules

- Centralize API access logic instead of scattering raw fetch calls everywhere
- Normalize auth token handling in one place
- Handle 401 and 403 responses predictably
- Parse and surface backend error messages safely

## State Guidance

- Keep server data flow simple and predictable
- Avoid overly complex state management unless the app truly needs it
- Local component state plus focused shared utilities is acceptable
- If introducing a data-fetching library, use it consistently

## Component Guidance

- Keep presentational components small and reusable
- Separate form concerns from page layout when practical
- Extract repeated UI patterns early if used across auth/profile/dashboard
- Do not over-abstract tiny one-use wrappers

## Routing Guidance

Expected routes will likely include:

- `/login`
- `/register`
- `/dashboard`
- `/profile`

Use route protection for authenticated screens.

## Task UX Guidance

Task interactions should feel immediate and clear.

Minimum expectations:

- Create task from the dashboard
- Show current task status visibly
- Update status with a clear control
- Confirm or clearly signal deletion

Preferred enhancement direction:

1. Filter by status
2. Sort by creation date or status
3. Kanban grouping if time allows and it remains simple

Filtering is the safest default if implementation time is limited.

## Styling Guidance

- Use Tailwind for layout, spacing, responsiveness, and visual consistency
- Use `shadcn/ui` as the base for buttons, inputs, dialogs, cards, dropdowns, and toasts
- Keep custom styles intentional and minimal
- Prefer design tokens and shared utility patterns over scattered ad hoc class combinations

## Frontend Quality Bar

- Clear file naming
- Clear prop naming
- Minimal duplication
- Accessible form labels and button text
- Predictable loading and error handling
- Responsive enough for common laptop and mobile sizes

