import { handle } from "hono/vercel";
import app from "../src/index";

const handler = handle(app);

export default async function (request: Request, context: { waitUntil?: (promise: Promise<void>) => void }) {
  try {
    const response = await handler(request, context);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Access-Control-Allow-Origin", "https://dashpage-web.vercel.app");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  } catch (error) {
    console.error("Handler error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  runtime: "nodejs18.x",
};