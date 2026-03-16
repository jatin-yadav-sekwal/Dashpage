import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let currentConnectionString: string | null = null;

function getDb(env?: { DATABASE_URL?: string }) {
  const connectionString = env?.DATABASE_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // If we already have an instance with the same connection string, return it
  if (dbInstance && currentConnectionString === connectionString) {
    return dbInstance;
  }
  
  console.log("[DB] Initializing new database connection...");
  const client = postgres(connectionString, { prepare: false });
  dbInstance = drizzle(client, { schema });
  currentConnectionString = connectionString;
  
  return dbInstance;
}

// Export a proxy that lazily initializes - maintains compatibility with existing code
// Note: This proxy might fail if getDb() is called without env and process.env is empty
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle<typeof schema>>];
  }
});

export { getDb };
