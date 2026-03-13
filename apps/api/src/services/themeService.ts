import { db } from "../db";
import { themes, profiles } from "../db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_THEMES = [
  {
    name: "Minimal Light",
    slug: "minimal-light",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#fafafa",
        surface: "#f1f5f9",
        primary: "#0f172a",
        text: "#1e293b",
        textSecondary: "#475569",
        accent: "#2563eb"
      },
      fonts: { heading: "Inter", body: "Inter" },
      borderRadius: "0.5rem",
      heroStyle: "split",
      experienceStyle: "timeline",
      educationStyle: "timeline",
      projectsStyle: "grid"
    }
  },
  {
    name: "Dark Pulse",
    slug: "dark-pulse",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#0a0a0f",
        surface: "#18181b",
        primary: "#fafafa",
        text: "#e4e4e7",
        textSecondary: "#a1a1aa",
        accent: "#818cf8"
      },
      fonts: { heading: "Outfit", body: "Inter" },
      borderRadius: "0.75rem",
      heroStyle: "centered",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "cards"
    }
  },
  {
    name: "Creative Studio",
    slug: "creative-studio",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#fffbeb",
        surface: "#fed7aa",
        primary: "#9a3412",
        text: "#7c2d12",
        textSecondary: "#9a3412",
        accent: "#ea580c"
      },
      fonts: { heading: "Poppins", body: "Poppins" },
      borderRadius: "1rem",
      heroStyle: "creative",
      experienceStyle: "cards",
      educationStyle: "minimal",
      projectsStyle: "masonry"
    }
  },
  {
    name: "Ocean Breeze",
    slug: "ocean-breeze",
    isPremium: true,
    price: 29900, // ₹299
    config: {
      colors: {
        background: "#f0f9ff",
        surface: "#e0f2fe",
        primary: "#0369a1",
        text: "#0c4a6e",
        textSecondary: "#155e75",
        accent: "#0ea5e9"
      },
      fonts: { heading: "Playfair Display", body: "Lato" },
      borderRadius: "0.5rem",
      heroStyle: "split",
      experienceStyle: "timeline",
      educationStyle: "timeline",
      projectsStyle: "grid"
    }
  },
  {
    name: "Nostalgia 90s",
    slug: "nostalgia-90s",
    isPremium: true,
    price: 50000, // ₹500
    config: {
      colors: {
        background: "#ebdbb2",
        surface: "#d5c4a1",
        primary: "#cc241d",
        text: "#282828",
        textSecondary: "#3c3836",
        accent: "#458588"
      },
      fonts: { heading: "Courier New", body: "Courier New" },
      borderRadius: "0rem",
      heroStyle: "minimal",
      experienceStyle: "minimal",
      educationStyle: "minimal",
      projectsStyle: "list"
    }
  }
];

export const themeService = {
  /**
   * Run this once during setup/startup to insert default themes if missing
   */
  async seedDefaultThemes() {
    for (const theme of DEFAULT_THEMES) {
      const existing = await db.query.themes.findFirst({
        where: eq(themes.slug, theme.slug)
      });
      if (!existing) {
        await db.insert(themes).values(theme);
      }
    }
  },

  async getAllThemes(userId?: string) {
    const allThemes = await db.query.themes.findMany({
      orderBy: (themes, { asc }) => [asc(themes.name)]
    });

    if (!userId) {
      return allThemes.map(t => ({ ...t, unlocked: !t.isPremium }));
    }

    // Get user purchases
    const userPurchases = await db.query.purchases.findMany({
      where: (purchases, { eq }) => eq(purchases.userId, userId)
    });

    const purchasedThemeIds = new Set(userPurchases.map(p => p.themeId));

    return allThemes.map(t => ({
      ...t,
      unlocked: !t.isPremium || purchasedThemeIds.has(t.id)
    }));
  },

  async applyTheme(userId: string, themeId: string) {
    const theme = await db.query.themes.findFirst({
      where: eq(themes.id, themeId)
    });

    if (!theme) {
      throw new Error("Theme not found");
    }

    if (theme.isPremium) {
      throw new Error("Cannot apply premium theme directly. Use payment endpoint.");
    }

    const [updated] = await db.update(profiles)
      .set({ themeId: theme.id, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();

    return updated;
  }
};
