import { handle } from "hono/vercel";
import app from "../index";

export default handle(app);

export const config = {
  runtime: "nodejs",
  maxDuration: 60,
};
