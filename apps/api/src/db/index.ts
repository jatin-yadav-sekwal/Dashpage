import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

const isServerless = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;

export function createDbConnection() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn("[DB] WARNING: DATABASE_URL is not set");
    throw new Error("DATABASE_URL is not set");
  }

  console.log("[DB] Creating database connection...", { isServerless });

  let finalConnectionString = connectionString;
  if (connectionString.includes("supabase") && connectionString.includes(":5432/")) {
    finalConnectionString = connectionString.replace(/:5432\//, ":6543/");
    console.log("[DB] Using Supabase pooler port 6543");
  }

  const options = {
    prepare: false,
    max: isServerless ? 1 : 10,
    idle_timeout: isServerless ? 20 : 20,
    connect_timeout: isServerless ? 10 : 10,
    max_lifetime: isServerless ? 60 : 300,
    keep_alive: isServerless ? 1 : 0,
  };

  const client = postgres(finalConnectionString, options);
  return drizzle(client, { schema });
}

export function getDb() {
  if (!dbInstance) {
    dbInstance = createDbConnection();
  }
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    const database = getDb();
    return (database as any)[prop];
  },
  apply(_target, _thisArg, args) {
    const database = getDb();
    return (database as any)(...args);
  }
});

export async function closeDbConnection() {
  if (dbInstance) {
    await dbInstance.$client.end();
    dbInstance = null;
    console.log("[DB] Connection closed");
  }
}
