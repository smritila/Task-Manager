# PostgreSQL Setup

This project uses PostgreSQL for the NestJS backend.

## 1. Install PostgreSQL on Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
```

## 2. Start PostgreSQL

```bash
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

## 3. Create the local database and user

Run the SQL script as the `postgres` superuser:

```bash
sudo -u postgres psql -f /home/smriti/my-projects/Task-Manager/backend/scripts/setup-postgres.sql
```

## 4. Create the backend environment file

```bash
cp /home/smriti/my-projects/Task-Manager/backend/.env.example /home/smriti/my-projects/Task-Manager/backend/.env
```

## 5. Verify the connection

```bash
psql -h localhost -U taskmanager_user -d taskmanager_db
```
