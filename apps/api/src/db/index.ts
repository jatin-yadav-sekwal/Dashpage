import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";



const connectionString = process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy";

if (!process.env.DATABASE_URL) {
  console.warn("[DB] WARNING: DATABASE_URL is not set. Database queries will fail.");
}

console.log("[DB] Initializing database connection...");
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
