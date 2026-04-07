#!/bin/sh
set -eu

POSTGRES_HOST="${POSTGRES_HOST:-db}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_SUPERUSER="${POSTGRES_SUPERUSER:-postgres}"
POSTGRES_SUPERDATABASE="${POSTGRES_SUPERDATABASE:-postgres}"
POSTGRES_SUPERPASSWORD="${POSTGRES_SUPERPASSWORD:-postgres}"

echo "Waiting for PostgreSQL at ${POSTGRES_HOST}:${POSTGRES_PORT}..."
until PGPASSWORD="${POSTGRES_SUPERPASSWORD}" pg_isready \
  -h "${POSTGRES_HOST}" \
  -p "${POSTGRES_PORT}" \
  -U "${POSTGRES_SUPERUSER}" \
  -d "${POSTGRES_SUPERDATABASE}"; do
  sleep 1
done

echo "Applying database setup script..."
PGPASSWORD="${POSTGRES_SUPERPASSWORD}" psql \
  -v ON_ERROR_STOP=1 \
  -h "${POSTGRES_HOST}" \
  -p "${POSTGRES_PORT}" \
  -U "${POSTGRES_SUPERUSER}" \
  -d "${POSTGRES_SUPERDATABASE}" \
  -f scripts/setup-postgres.sql

echo "Seeding application data..."
npm run seed
