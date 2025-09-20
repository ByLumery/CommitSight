#!/bin/sh

echo "Waiting for PostgreSQL to start..."
sleep 10

echo "Running database migrations..."
npx prisma migrate dev --name init

echo "Generating Prisma client..."
npx prisma generate

echo "Database setup complete!"
