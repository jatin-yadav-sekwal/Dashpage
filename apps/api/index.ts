import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import profileRoutes from "./src/routes/profile";
import experienceRoutes from "./src/routes/experiences";
import educationRoutes from "./src/routes/educations";
import projectRoutes from "./src/routes/projects";
import tagRoutes from "./src/routes/tags";
import uploadRoutes from "./src/routes/upload";
import themeRoutes from "./src/routes/themes";
import paymentRoutes from "./src/routes/payments";
import bookmarkRoutes from "./src/routes/bookmarks";
import publicRoutes from "./src/routes/public";
import type { Env } from "./src/middleware/auth";

type Variables = Env["Variables"];

type Bindings = {
  DATABASE_URL: string;
  FRONTEND_URL: string;
  CORS_ORIGIN: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_JWKS_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const app = new Hono<{ Variables: Variables; Bindings: Bindings }>();

app.use("*", logger());

app.use(
  "*",
  cors({
    origin: (origin) => {
      const frontendUrl = process.env.FRONTEND_URL || "https://dashpage-web.vercel.app";
      const corsOrigin = process.env.CORS_ORIGIN;
      const allowedOrigins = [
        frontendUrl,
        corsOrigin,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://dashpage-web.vercel.app",
      ].filter((url): url is string => !!url);

      if (!origin) return allowedOrigins[0] || "*";
      if (allowedOrigins.includes(origin)) return origin;

      console.log(`[CORS] Blocked origin: ${origin}`);
      return allowedOrigins[0] || "*";
    },
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => c.json({ status: "ok", name: "Dashpage API", version: "2.0" }));

app.get("/debug", async (c) => {
  const dbUrl = process.env.DATABASE_URL ? "configured" : "missing";
  const supabaseUrl = process.env.SUPABASE_URL ? "configured" : "missing";
  
  return c.json({
    status: "ok",
    message: "API is working",
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: dbUrl,
      SUPABASE_URL: supabaseUrl,
    }
  });
});

app.route("/api", profileRoutes);
app.route("/api", experienceRoutes);
app.route("/api", educationRoutes);
app.route("/api", projectRoutes);
app.route("/api", tagRoutes);
app.route("/api/themes", themeRoutes);
app.route("/api/me/bookmarks/", bookmarkRoutes);
app.route("/api/me/payments", paymentRoutes);
app.route("/api/upload", uploadRoutes);
app.route("/api", publicRoutes);

export default app;
