import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@luccello/database";

let pool: Pool | undefined;
let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDatabase() {
  if (db) return db;
  const connectionString =
    process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/luccello";
  pool = new Pool({ connectionString, max: 10 });
  db = drizzle(pool, { schema });
  return db;
}

export async function closeDatabase() {
  await pool?.end();
  pool = undefined;
  db = undefined;
}
