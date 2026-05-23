import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";

const PLAN_MAP: Record<string, { plan: string; months: number }> = {
  pro_monthly: { plan: "pro", months: 1 },
  pro_yearly: { plan: "pro", months: 12 },
  premium_monthly: { plan: "premium", months: 1 },
  premium_yearly: { plan: "premium", months: 12 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSig !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const entity = event.payload.payment.entity;
      const { notes, id: paymentId, order_id: orderId, amount, currency } = entity;
      const { userId, planId } = notes || {};

      if (userId && planId) {
        const { plan, months } = PLAN_MAP[planId] || { plan: "pro", months: 1 };
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + months);

        await connectDB();

        // Save payment transaction
        await Payment.findOneAndUpdate(
          { razorpayOrderId: orderId },
          {
            userId,
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            planId,
            plan,
            amount,
            currency,
            status: "captured",
            expiresAt,
          },
          { upsert: true, new: true }
        );

        // Update user subscription
        await User.findOneAndUpdate(
          { clerkId: userId },
          {
            $set: {
              "subscription.plan": plan,
              "subscription.status": "active",
              "subscription.startDate": new Date(),
              "subscription.expiresAt": expiresAt,
            },
          },
          { upsert: true }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
