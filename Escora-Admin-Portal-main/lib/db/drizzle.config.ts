import { defineConfig } from "drizzle-kit";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // Exclude the session table — it's managed via raw SQL in app.ts,
  // not through Drizzle schema. Without this, drizzle-kit push asks
  // for TTY confirmation to drop it on every Railway deployment.
  tablesFilter: ["!session"],
});
