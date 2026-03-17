import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
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
import type { Env } from "./middleware/auth";

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

app.use("*", timing());
app.use("*", logger());

const ALLOWED_ORIGINS = [
  "https://dashpage-web.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  "*",
  cors({
    origin: (origin) => {
      const frontendUrl = process.env.FRONTEND_URL;
      const corsOrigin = process.env.CORS_ORIGIN;
      
      const allowedOrigins = ALLOWED_ORIGINS.filter(Boolean);
      if (corsOrigin) allowedOrigins.push(corsOrigin);
      if (frontendUrl) allowedOrigins.push(frontendUrl);

      if (!origin) return allowedOrigins[0] || "*";
      if (allowedOrigins.includes(origin)) return origin;

      console.log(`[CORS] Blocked origin: ${origin}`);
      return allowedOrigins[0] || "*";
    },
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
    credentials: true,
  })
);

app.onError((err, c) => {
  console.error("[API Error]", err.message);
  return c.json({ 
    error: err.message || "Internal Server Error",
    requestId: c.req.header("X-Request-Id")
  }, 500);
});

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

app.get("/", (c) => c.json({ 
  status: "ok", 
  name: "Dashpage API", 
  version: "2.0",
  nodeVersion: process.version
}));

app.get("/debug", async (c) => {
  const dbUrl = process.env.DATABASE_URL ? "configured" : "missing";
  const supabaseUrl = process.env.SUPABASE_URL ? "configured" : "missing";
  
  return c.json({
    status: "ok",
    message: "API is working",
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
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
