import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";



const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("[DB] DATABASE_URL is not set.");
}

console.log("[DB] Initializing database connection...");
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
