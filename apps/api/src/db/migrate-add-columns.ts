import { db } from "../db";
import { profiles } from "../db/schema";
import { sql } from "drizzle-orm";

async function main() {
  try {
    // Add date_of_birth column if not exists
    await db.execute(sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE`);
    console.log("✓ Added date_of_birth column");
    
    // Add profession column if not exists
    await db.execute(sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profession TEXT`);
    console.log("✓ Added profession column");
    
    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

main();
