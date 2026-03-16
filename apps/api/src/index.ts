import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import profileRoutes from "./routes/profile";
import experienceRoutes from "./routes/experiences";
import educationRoutes from "./routes/educations";
import projectRoutes from "./routes/projects";
import tagRoutes from "./routes/tags";
import uploadRoutes from "./routes/upload";
import themeRoutes from "./routes/themes";
import paymentRoutes from "./routes/payments";
import bookmarkRoutes from "./routes/bookmarks";
import publicRoutes from "./routes/public";
import { themeService } from "./services/themeService";
import type { Env } from "./middleware/auth";

type Variables = Env["Variables"];

type Bindings = {
  DATABASE_URL: string;
  FRONTEND_URL: string;
  CORS_ORIGIN: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Global Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        process.env.WEB_URL,
        process.env.CORS_ORIGIN,
        "http://localhost:5173",
        "https://dashpage-an6.pages.dev",
        "https://43b7aa58.dashpage-an6.pages.dev",
        "https://ebc45530.dashpage-an6.pages.dev",
      ].filter((url): url is string => !!url);

      if (!origin) return allowedOrigins[0] || "*";
      if (allowedOrigins.includes(origin)) return origin;

      console.log(`[CORS] Blocked origin: ${origin}`);
      return allowedOrigins[0];
    },
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Health Check (public)
app.get("/", (c) => c.json({ status: "ok", name: "Dashpage API" }));

// Debug endpoint - accessible from phone to check if API is reachable
app.get("/debug", async (c) => {
  console.log("[DEBUG] API debug endpoint hit");
  return c.json({
    status: "ok",
    message: "API is working",
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "configured" : "missing",
      SUPABASE_URL: process.env.SUPABASE_URL ? "configured" : "missing",
    }
  });
});

// Mount ALL Routes
// Public routes (already have their own paths defined in each route file)
app.route("/api", profileRoutes);           // /api/profiles/:username, /api/username/check
app.route("/api", experienceRoutes);        // /api/profiles/:username/experiences
app.route("/api", educationRoutes);         // /api/profiles/:username/educations
app.route("/api", projectRoutes);           // /api/profiles/:username/projects
app.route("/api", tagRoutes);               // /api/tags (GET /profiles/:username/tags, PUT /me/tags)

// Protected routes - mounted at specific paths (must be BEFORE publicRoutes to avoid catch-all conflict)
app.route("/api/themes", themeRoutes);      // /api/themes (GET), /api/themes (POST)
app.route("/api/me/bookmarks/", bookmarkRoutes); // /api/me/bookmarks/ (with trailing slash)
app.route("/api/me/payments", paymentRoutes);    // /api/me/payments/create-order, /api/me/payments/verify
app.route("/api/upload", uploadRoutes);     // /api/upload/me/avatar, /api/upload/me/projects/:id/image

// Public username route (catch-all - must be last)
app.route("/api", publicRoutes);            // /api/:username (all data in one call)

// Export for Cloudflare Workers
export default {
  async fetch(request: Request, env: Bindings, ctx: any) {
    return app.fetch(request, env, ctx);
  },
};
