import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { themes } from "./schema";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

// Create Postgres client
const client = postgres(connectionString);
const db = drizzle(client);

// Define themes (2 Free, 3 Premium)
const predefinedThemes = [
  {
    name: "Minimal Light",
    slug: "minimal-light",
    previewImage: "https://images.unsplash.com/photo-1544257134-2900ce2ce4bd?auto=format&fit=crop&q=80&w=600&h=400",
    isPremium: false,
    price: null,
    config: {
      colors: {
        background: "#ffffff",
        surface: "#f8fafc",
        primary: "#0f172a",
        text: "#0f172a",
        textSecondary: "#64748b",
        accent: "#3b82f6",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      layout: "modern",
      borderRadius: "md",
      heroStyle: "centered",
    },
  },
  {
    name: "Dark Void",
    slug: "dark-void",
    previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=400",
    isPremium: false,
    price: null,
    config: {
      colors: {
        background: "#09090b",
        surface: "#18181b",
        primary: "#fafafa",
        text: "#fafafa",
        textSecondary: "#a1a1aa",
        accent: "#3b82f6",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      layout: "modern",
      borderRadius: "md",
      heroStyle: "left-aligned",
    },
  },
  {
    name: "Neon Cyber",
    slug: "neon-cyber",
    previewImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600&h=400",
    isPremium: true,
    price: 49900, // ₹499
    config: {
      colors: {
        background: "#050517",
        surface: "#11112b",
        primary: "#00f0ff",
        text: "#ffffff",
        textSecondary: "#8f9bb3",
        accent: "#ff007b",
      },
      fonts: {
        heading: "Space Grotesk",
        body: "Inter",
      },
      layout: "bold",
      borderRadius: "none",
      heroStyle: "centered",
    },
  },
  {
    name: "Serene Nature",
    slug: "serene-nature",
    previewImage: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600&h=400",
    isPremium: true,
    price: 39900, // ₹399
    config: {
      colors: {
        background: "#f4f1ea",
        surface: "#ffffff",
        primary: "#2d4a22",
        text: "#2c3e2d",
        textSecondary: "#5c705d",
        accent: "#e07a5f",
      },
      fonts: {
        heading: "Playfair Display",
        body: "Lora",
      },
      layout: "classic",
      borderRadius: "full",
      heroStyle: "split",
    },
  },
  {
    name: "Executive Minimal",
    slug: "executive-minimal",
    previewImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600&h=400",
    isPremium: true,
    price: 59900, // ₹599
    config: {
      colors: {
        background: "#ffffff",
        surface: "#ffffff",
        primary: "#111827",
        text: "#111827",
        textSecondary: "#4b5563",
        accent: "#000000",
      },
      fonts: {
        heading: "Syncopate", // or another premium font
        body: "Outfit",
      },
      layout: "minimal",
      borderRadius: "none",
      heroStyle: "left-aligned",
    },
  },
];

async function seed() {
  console.log("🌱 Seeding themes to the database...");

  try {
    for (const theme of predefinedThemes) {
      // Upsert pattern using INSERT ... ON CONFLICT
      await db
        .insert(themes)
        .values(theme)
        .onConflictDoUpdate({
          target: themes.slug,
          set: {
            name: theme.name,
            previewImage: theme.previewImage,
            isPremium: theme.isPremium,
            price: theme.price,
            config: theme.config,
          },
        });
      console.log(`✅ Seeded theme: ${theme.name}`);
    }

    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    // Close connection properly
    client.end();
  }
}

seed();
