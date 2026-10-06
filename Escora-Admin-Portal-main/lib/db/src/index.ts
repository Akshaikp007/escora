import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  // Allow the server to start without a DB — auth works, DB routes fail at query time.
  console.warn("[db] DATABASE_URL is not set. The server will start but all database operations will fail.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? "postgres://localhost:5432/escora_dev" });
export const db = drizzle(pool, { schema });

export * from "./schema";
