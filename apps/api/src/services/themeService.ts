import { db } from "../db";
import { themes, profiles } from "../db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_THEMES = [
  // === FREE THEMES ===
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
  // === NEW THEMES FOR DIFFERENT PERSONALITIES ===
  
  // Developer/Engineer Themes
  {
    name: "Developer Pro",
    slug: "developer-pro",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#0d1117",
        surface: "#161b22",
        primary: "#58a6ff",
        text: "#c9d1d9",
        textSecondary: "#8b949e",
        accent: "#238636"
      },
      fonts: { heading: "JetBrains Mono", body: "Inter" },
      borderRadius: "0.5rem",
      heroStyle: "split",
      experienceStyle: "cards",
      educationStyle: "timeline",
      projectsStyle: "grid"
    }
  },
  {
    name: "Matrix Code",
    slug: "matrix-code",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#000000",
        surface: "#0d0d0d",
        primary: "#00ff41",
        text: "#00ff41",
        textSecondary: "#008F11",
        accent: "#00ff41"
      },
      fonts: { heading: "Courier Prime", body: "Courier Prime" },
      borderRadius: "0rem",
      heroStyle: "minimal",
      experienceStyle: "minimal",
      educationStyle: "minimal",
      projectsStyle: "list"
    }
  },
  
  // Designer/Creative Themes
  {
    name: "Soft Pastel",
    slug: "soft-pastel",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#fdf2f8",
        surface: "#fce7f3",
        primary: "#831843",
        text: "#831843",
        textSecondary: "#9d174d",
        accent: "#ec4899"
      },
      fonts: { heading: "Quicksand", body: "Quicksand" },
      borderRadius: "1rem",
      heroStyle: "centered",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "masonry"
    }
  },
  {
    name: "Sunset Creative",
    slug: "sunset-creative",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#fff7ed",
        surface: "#ffedd5",
        primary: "#9a3412",
        text: "#7c2d12",
        textSecondary: "#c2410c",
        accent: "#f97316"
      },
      fonts: { heading: "Playfair Display", body: "Lora" },
      borderRadius: "0.75rem",
      heroStyle: "creative",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "masonry"
    }
  },
  {
    name: "Rose Gold",
    slug: "rose-gold",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#faf5f3",
        surface: "#f5e6e3",
        primary: "#881337",
        text: "#4a044e",
        textSecondary: "#9d174d",
        accent: "#e11d48"
      },
      fonts: { heading: "Cormorant Garamond", body: "Inter" },
      borderRadius: "1rem",
      heroStyle: "centered",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "grid"
    }
  },
  
  // Corporate/Professional Themes
  {
    name: "Corporate Blue",
    slug: "corporate-blue",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#f8fafc",
        surface: "#e2e8f0",
        primary: "#1e3a5f",
        text: "#1e293b",
        textSecondary: "#475569",
        accent: "#0f766e"
      },
      fonts: { heading: "Montserrat", body: "Open Sans" },
      borderRadius: "0.25rem",
      heroStyle: "split",
      experienceStyle: "timeline",
      educationStyle: "timeline",
      projectsStyle: "grid"
    }
  },
  {
    name: "Executive Dark",
    slug: "executive-dark",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#0f172a",
        surface: "#1e293b",
        primary: "#f8fafc",
        text: "#e2e8f0",
        textSecondary: "#94a3b8",
        accent: "#38bdf8"
      },
      fonts: { heading: "Inter", body: "Inter" },
      borderRadius: "0.5rem",
      heroStyle: "centered",
      experienceStyle: "timeline",
      educationStyle: "timeline",
      projectsStyle: "grid"
    }
  },
  
  // Nature/Environment Themes
  {
    name: "Forest Green",
    slug: "forest-green",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#f0fdf4",
        surface: "#dcfce7",
        primary: "#14532d",
        text: "#166534",
        textSecondary: "#15803d",
        accent: "#22c55e"
      },
      fonts: { heading: "Merriweather", body: "Source Sans Pro" },
      borderRadius: "0.5rem",
      heroStyle: "split",
      experienceStyle: "timeline",
      educationStyle: "timeline",
      projectsStyle: "grid"
    }
  },
  {
    name: "Ocean Deep",
    slug: "ocean-deep",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#0c1929",
        surface: "#132f4c",
        primary: "#ffffff",
        text: "#b2bac2",
        textSecondary: "#8a9ab0",
        accent: "#29b6f6"
      },
      fonts: { heading: "Nunito Sans", body: "Nunito Sans" },
      borderRadius: "0.75rem",
      heroStyle: "centered",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "cards"
    }
  },
  
  // Student/Academic Themes
  {
    name: "Academic",
    slug: "academic",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#fdfbf7",
        surface: "#f5f0e6",
        primary: "#3d2914",
        text: "#5c4033",
        textSecondary: "#8b7355",
        accent: "#b45309"
      },
      fonts: { heading: "Libre Baskerville", body: "Source Serif Pro" },
      borderRadius: "0.25rem",
      heroStyle: "split",
      experienceStyle: "timeline",
      educationStyle: "timeline",
      projectsStyle: "list"
    }
  },
  {
    name: "Campus Life",
    slug: "campus-life",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#fefce8",
        surface: "#fef08a",
        primary: "#713f12",
        text: "#854d0e",
        textSecondary: "#a16207",
        accent: "#eab308"
      },
      fonts: { heading: "Poppins", body: "Poppins" },
      borderRadius: "0.75rem",
      heroStyle: "creative",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "grid"
    }
  },
  
  // Tech/Modern Themes
  {
    name: "Electric Blue",
    slug: "electric-blue",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#030712",
        surface: "#111827",
        primary: "#06b6d4",
        text: "#e0f2fe",
        textSecondary: "#7dd3fc",
        accent: "#22d3ee"
      },
      fonts: { heading: "Orbitron", body: "Rajdhani" },
      borderRadius: "0.5rem",
      heroStyle: "centered",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "grid"
    }
  },
  {
    name: "Cyber Punk",
    slug: "cyber-punk",
    isPremium: false,
    price: 0,
    config: {
      colors: {
        background: "#120458",
        surface: "#1a1a2e",
        primary: "#ff00ff",
        text: "#e0e0e0",
        textSecondary: "#b0b0b0",
        accent: "#00ffff"
      },
      fonts: { heading: "Orbitron", body: "Share Tech Mono" },
      borderRadius: "0rem",
      heroStyle: "creative",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "masonry"
    }
  },
  
  // Premium Themes
  {
    name: "Midnight Purple",
    slug: "midnight-purple",
    isPremium: true,
    price: 19900, // ₹199
    config: {
      colors: {
        background: "#0f0a1e",
        surface: "#1a1428",
        primary: "#e9d5ff",
        text: "#e9d5ff",
        textSecondary: "#a78bfa",
        accent: "#a855f7"
      },
      fonts: { heading: "Cinzel", body: "Inter" },
      borderRadius: "0.75rem",
      heroStyle: "centered",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "grid"
    }
  },
  {
    name: "Royal Gold",
    slug: "royal-gold",
    isPremium: true,
    price: 29900, // ₹299
    config: {
      colors: {
        background: "#1c1917",
        surface: "#292524",
        primary: "#fafaf9",
        text: "#fafaf9",
        textSecondary: "#a8a29e",
        accent: "#d97706"
      },
      fonts: { heading: "Playfair Display", body: "Inter" },
      borderRadius: "0.5rem",
      heroStyle: "split",
      experienceStyle: "timeline",
      educationStyle: "timeline",
      projectsStyle: "grid"
    }
  },
  {
    name: "Nordic Gray",
    slug: "nordic-gray",
    isPremium: true,
    price: 14900, // ₹149
    config: {
      colors: {
        background: "#f5f5f4",
        surface: "#e7e5e4",
        primary: "#292524",
        text: "#1c1917",
        textSecondary: "#57534e",
        accent: "#78716c"
      },
      fonts: { heading: "DM Sans", body: "DM Sans" },
      borderRadius: "0.25rem",
      heroStyle: "minimal",
      experienceStyle: "minimal",
      educationStyle: "minimal",
      projectsStyle: "list"
    }
  },
  {
    name: "Cherry Blossom",
    slug: "cherry-blossom",
    isPremium: true,
    price: 24900, // ₹249
    config: {
      colors: {
        background: "#fff1f2",
        surface: "#ffe4e6",
        primary: "#881337",
        text: "#9f1239",
        textSecondary: "#be123c",
        accent: "#f43f5e"
      },
      fonts: { heading: "Noto Serif JP", body: "Noto Sans JP" },
      borderRadius: "0.75rem",
      heroStyle: "centered",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "masonry"
    }
  },
  {
    name: "Mint Fresh",
    slug: "mint-fresh",
    isPremium: true,
    price: 19900, // ₹199
    config: {
      colors: {
        background: "#ecfeff",
        surface: "#cffafe",
        primary: "#164e63",
        text: "#155e75",
        textSecondary: "#0e7490",
        accent: "#06b6d4"
      },
      fonts: { heading: "Quicksand", body: "Nunito" },
      borderRadius: "1rem",
      heroStyle: "split",
      experienceStyle: "cards",
      educationStyle: "cards",
      projectsStyle: "grid"
    }
  },
  {
    name: "Vintage Paper",
    slug: "vintage-paper",
    isPremium: true,
    price: 24900, // ₹249
    config: {
      colors: {
        background: "#f5f0e1",
        surface: "#e8e0cc",
        primary: "#3d2914",
        text: "#4a3728",
        textSecondary: "#6b5344",
        accent: "#92400e"
      },
      fonts: { heading: "Crimson Text", body: "Crimson Text" },
      borderRadius: "0rem",
      heroStyle: "minimal",
      experienceStyle: "timeline",
      educationStyle: "timeline",
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
        await db.insert(themes).values(theme as any);
        console.log(`[ThemeService] Seeded theme: ${theme.name}`);
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
