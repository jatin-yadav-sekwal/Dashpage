import { Hono } from "hono";
import type { Variables, Env } from "../middleware/auth";
import { paymentService } from "../services/paymentService";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const router = new Hono<{ Variables: Variables }>();

const createOrderSchema = z.object({
  themeId: z.string().uuid()
});

router.post(
  "/create-order",
  zValidator("json", createOrderSchema),
  async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const { themeId } = c.req.valid("json");

    try {
      const env = {
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
      };
      const orderDetails = await paymentService.createOrder(userId, themeId, env);
      return c.json({ data: orderDetails });
    } catch (e: any) {
      return c.json({ error: e.message }, 400);
    }
  }
);

const verifySchema = z.object({
  themeId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string()
});

router.post(
  "/verify",
  zValidator("json", verifySchema),
  async (c) => {
    const userId = c.get("userId");
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const data = c.req.valid("json");

    try {
      const env = {
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
      };
      const result = await paymentService.verifyPayment(
        userId, 
        data.themeId, 
        data.razorpay_order_id, 
        data.razorpay_payment_id, 
        data.razorpay_signature, 
        env
      );
      return c.json({ data: result });
    } catch (e: any) {
      return c.json({ error: e.message }, 400);
    }
  }
);

export default router;
