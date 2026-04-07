# Task Manager

## Docker workflow

Start the full application stack with:

```bash
docker compose up --build
```

This starts:

- PostgreSQL
- the one-shot database setup and seed flow
- the NestJS backend
- the React frontend

Once the containers are healthy, open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

Seeded demo credentials:

- `ava.thompson@example.com` / `Password123!`
- `marcus.lee@example.com` / `Password123!`
- `priya.patel@example.com` / `Password123!`
