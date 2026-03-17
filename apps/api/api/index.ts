import { handle } from "hono/vercel";
import app from "../index";

const handler = handle(app);

export default async function (request: Request, context: { waitUntil?: (promise: Promise<void>) => void }) {
  const response = await handler(request);
  
  response.headers.set("X-Node-Version", process.version);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  
  return response;
}

export const config = {
  runtime: "nodejs20.x",
  maxDuration: 60,
};
