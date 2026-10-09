# PostgreSQL

The database is PostgreSQL 16 running locally or in a Docker Compose service. Drizzle schema lives in `database/schema/schema.ts`; migrations are generated into `database/migrations`.

Run migrations with `corepack pnpm --filter @luccello/api exec drizzle-kit migrate` when the database is accessible. The full local Docker stack includes a startup migration service.
