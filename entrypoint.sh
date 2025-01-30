#!/bin/bash

# Function to check if the database is ready
wait_for_db() {
  echo "Waiting for the database connection..."
  while ! nc -z postgres 5432; do
    echo "Waiting for the database to be available..."
    sleep 1
  done
  echo "Database successfully connected!"
}

# Check if the database is ready
wait_for_db

# Run the migrations with Alembic
alembic upgrade head

# Use the TEST_MODE variable to determine if the environment is for testing or production
if [ "$TEST_MODE" = "true" ]; then
  echo "Starting API in development/testing mode (debug)..."
  exec uvicorn ebc.api.app:app --host 0.0.0.0 --port 8000 --reload
else
  echo "Starting API in production mode..."
  exec gunicorn -k uvicorn.workers.UvicornWorker -w ${GUNICORN_WORKERS:-4} -b 0.0.0.0:8000 ebc.api.app:app
fi
