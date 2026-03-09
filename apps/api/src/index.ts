import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware } from "./middleware/auth";
import type { Env } from "./middleware/auth";
import profileRoutes from "./routes/profile";

const app = new Hono<Env>();

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

// Mount Routes
app.route("/api", profileRoutes);

const port = Number(process.env.PORT) || 3000;
console.log(`🚀 Dashpage API running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
