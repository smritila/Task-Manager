# Backend Agent Steering

## Backend Goal

Build a clean NestJS REST API for authentication, profile access, and task management backed by PostgreSQL.

## Required Backend Scope

- User registration
- User login
- JWT authentication
- Authenticated profile endpoint
- Task create/read/update/delete endpoints
- Support task status management

## Stack Direction

- NestJS
- PostgreSQL
- JWT auth

No ORM is required for this project.

## Module Structure

Prefer a clean feature-based structure such as:

- `auth/`
- `users/`
- `tasks/`
- `common/`
- `database/`

Keep modules cohesive and avoid mixing unrelated concerns.

## API Design Rules

- Keep controllers thin
- Put business logic in services
- Use DTOs for request validation
- Use guards for auth-protected routes
- Return predictable JSON response shapes

## Authentication Guidance

Simple JWT authentication is acceptable for this project.

Minimum expectations:

- Register endpoint
- Login endpoint
- Password hashing
- JWT issuance on successful login
- Protected routes for profile and task actions

## Validation and Error Handling

This is a required evaluation area.

Agents must ensure:

- Request validation is enforced
- Invalid input returns clear 4xx responses
- Missing resources return proper 404 responses
- Unauthorized access returns proper 401 responses
- Forbidden actions return 403 where relevant
- Unhandled internal failures return safe 500 responses

Do not return raw stack traces, SQL errors, or framework internals to the client.

Prefer consistent error response shapes across the API.

## Task Domain Guidance

Minimum task fields:

- `id`
- `title`
- `description` optional
- `status`
- `createdAt`
- `updatedAt`
- `userId`

Suggested status values:

- `todo`
- `in_progress`
- `done`

Keep status values consistent across backend and frontend.

## Authorization Guidance

- Users should only access their own profile and tasks
- Task queries must be scoped to the authenticated user
- Task update/delete actions must verify ownership

## Data and Persistence Guidance

- Use PostgreSQL as the source of truth
- Keep database access patterns consistent and explicit
- Keep schema naming clear and conventional
- Include a migration strategy
- Prefer explicit relations between users and tasks

## Response Quality

API responses should be:

- Clean
- Consistent
- Easy for frontend consumption
- Free of unnecessary nesting unless justified

## Maintainability Rules

- Descriptive DTO, service, and method names
- Avoid giant service classes
- Extract shared concerns into `common/` only when truly shared
- Keep auth logic and task logic separate

## Suggested Backend Build Order

1. Database schema and user/task models
2. Auth module
3. User/profile endpoint
4. Task CRUD endpoints
5. Validation and error handling polish
6. Security and response cleanup
