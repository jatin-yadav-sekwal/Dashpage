import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "../db";
import { themes, purchases, profiles } from "../db/schema";
import { eq } from "drizzle-orm";

let razorpayInstance: Razorpay | null = null;

const getRazorpay = (env: any) => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

export const paymentService = {
  /** Creates an order with Razorpay */
  async createOrder(userId: string, themeId: string, env: any) {
    const theme = await db.query.themes.findFirst({
      where: eq(themes.id, themeId)
    });

    if (!theme || !theme.isPremium || !theme.price) {
      throw new Error("Invalid or non-premium theme requested for purchase");
    }

    const rzp = getRazorpay(env);

    // Create an order on Razorpay
    const order = await rzp.orders.create({
      amount: theme.price, // Amount is in currency subunits (paisa).
      currency: "INR",
      receipt: `receipt_${theme.id.substring(0, 8)}`,
      notes: {
        userId,
        themeId,
      }
    });

    // Record the intent in DB
    await db.insert(purchases).values({
      userId,
      themeId,
      amount: theme.price,
      razorpayOrderId: order.id,
      status: "created"
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.RAZORPAY_KEY_ID
    };
  },

  /** Verifies successful payment signature and activates theme */
  async verifyPayment(
    userId: string, 
    themeId: string, 
    orderId: string, 
    paymentId: string, 
    signature: string, 
    env: any
  ) {
    // 1. Verify Crypto Signature
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (expectedSignature !== signature) {
      // Mark failed
      await db.update(purchases)
        .set({ status: "failed" })
        .where(eq(purchases.razorpayOrderId, orderId));
      throw new Error("Invalid payment signature");
    }

    // 2. Mark payment successful
    const [purchase] = await db.update(purchases)
      .set({ 
        status: "success", 
        razorpayPaymentId: paymentId
      })
      .where(eq(purchases.razorpayOrderId, orderId))
      .returning();

    // 3. Immediately apply theme to user profile
    await db.update(profiles)
      .set({ themeId: purchase.themeId, updatedAt: new Date() })
      .where(eq(profiles.userId, userId));

    return { success: true };
  }
};
