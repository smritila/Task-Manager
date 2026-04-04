# Task Manager Agent Steering

## Project Intent

Build a full-stack task management web app with:

- User registration
- User login with simple JWT authentication
- User profile
- User dashboard
- Task CRUD
- At least one task organization enhancement:
  - filter by status, or
  - sort tasks, or
  - group tasks in a simple Kanban-style view

This repository is organized as:

- `frontend/` for the React application
- `backend/` for the NestJS REST API

## Core Product Expectations

Agents working in this repo should optimize for:

- Clean architecture and maintainable structure
- Readable, well-named code
- Consistent UI and UX
- Proper loading, empty, and error states
- Secure authentication and backend validation
- Clear API boundaries between frontend and backend

## Stack Decisions

- Frontend: React
- Styling: Tailwind CSS
- UI components: `shadcn/ui`
- Backend: NestJS
- API style: REST
- Database: PostgreSQL with Prisma ORM
- Authentication: simple JWT auth

## Database Guidance

PostgreSQL is mandatory.

Prisma is also required for this project.

Agents should use Prisma for:

- Schema definition
- Migrations
- Typed database access
- Relational modeling between users and tasks

## Architecture Rules

- Keep frontend and backend responsibilities clearly separated.
- Keep business logic out of UI components where possible.
- Keep controllers thin and services focused in the backend.
- Prefer feature-based organization over dumping by file type only.
- Shared concepts should use consistent naming across frontend, backend, and database.
- Avoid premature abstraction, but extract reusable code once duplication becomes real.

## Minimum Functional Scope

### Authentication

- Register with validated inputs
- Login with validated inputs
- JWT-based authenticated routes
- Logout behavior on frontend by clearing auth state/token

### Profile

- View current user profile on authenticated screen
- Profile data should come from the backend, not hardcoded client state

### Dashboard

- Show current user context
- Show task list with loading, empty, and error states
- Support create, update status, and delete task
- Include at least one enhancement:
  - status filtering, or
  - sorting, or
  - simple Kanban grouping

## Error Handling Requirements

### Backend

- Return clean, consistent HTTP error responses
- Validate request bodies, params, and auth-protected routes
- Do not leak internal stack traces or raw database errors to clients
- Use standard status codes and meaningful messages

### Frontend

- Show user-facing error feedback for failed actions
- Use inline errors and/or toast feedback where appropriate
- Handle loading and retry-friendly states
- Avoid silent failures

## Security Expectations

- Hash passwords securely
- Validate and sanitize incoming data
- Protect authenticated routes with guards/middleware
- Never expose secrets in frontend code
- Keep auth flow simple, but not careless

## UI and UX Expectations

- Use a structured, visually clear layout
- Prefer reusable components over one-off UI
- Maintain spacing, hierarchy, and consistency
- Support at least minimal responsiveness for desktop and mobile
- Include visible loading states for async flows
- Empty states should feel intentional, not broken

## Code Quality Rules

- Favor clarity over cleverness
- Use descriptive names
- Keep files and functions focused
- Add comments only where they reduce real ambiguity
- Keep modules and components easy to navigate

## Suggested Delivery Order

1. Define database schema and auth model
2. Implement backend auth and task APIs
3. Build frontend app shell and auth flows
4. Build dashboard and task interactions
5. Add loading states, validation, and error UX
6. Refine UI consistency and responsiveness

## Agent Workflow

Before major implementation work, agents should:

- Read this file
- Read the local `frontend/AGENTS.md` or `backend/AGENTS.md`
- Preserve the agreed stack and architecture choices
- Avoid introducing alternate patterns unless clearly justified

When making tradeoffs, prioritize:

1. Correctness
2. Maintainability
3. User clarity
4. Visual polish
