# Database

PostgreSQL is the local database target and Aurora PostgreSQL Serverless v2 is the AWS target. Drizzle schema lives in `database/schema/schema.ts`; migrations are generated into `database/migrations`.

Sensitive checkout and inventory paths must use transactions with row-level locks in the production repository layer. The local in-memory service mirrors the reservation lifecycle for tests while keeping the app runnable before AWS credentials exist.
