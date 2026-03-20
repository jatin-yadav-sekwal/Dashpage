import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
// NOTE: hono/timing removed — it's a Cloudflare Server-Timing middleware
// that adds overhead on Vercel's Node.js runtime without benefit.
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

// Vercel uses process.env — no Cloudflare-style Bindings needed.
type Variables = Env["Variables"];

const app = new Hono<{ Variables: Variables }>();
app.use("*", secureHeaders());
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

// ── Global Error Handler ───────────────────────────────────
// Catches all errors thrown inside Hono route handlers.
// Classifies errors and returns structured JSON responses.
app.onError((err, c) => {
  const method = c.req.method;
  const path = new URL(c.req.url).pathname;
  const requestId = c.req.header("X-Request-Id") || "none";

  console.error("[API Error]", {
    method,
    path,
    requestId,
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  // Classify known error types for proper HTTP status codes
  const status = (err as any).status || 500;

  return c.json(
    {
      error: status === 500 ? "Internal Server Error" : err.message,
      code: status === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
      requestId,
    },
    status
  );
});

// ── 404 Handler ────────────────────────────────────────────
app.notFound((c) => {
  const path = new URL(c.req.url).pathname;
  console.warn(`[API] 404 Not Found: ${c.req.method} ${path}`);
  return c.json({ error: "Not Found", code: "NOT_FOUND", path }, 404);
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
