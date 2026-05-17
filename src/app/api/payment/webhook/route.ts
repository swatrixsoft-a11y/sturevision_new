import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

// Razorpay webhook — verify signature and activate subscription
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSig !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const { notes } = event.payload.payment.entity;
      const { userId, planId } = notes || {};

      if (userId && planId) {
        await connectDB();

        const planMap: Record<string, { plan: string; months: number }> = {
          pro_monthly: { plan: "pro", months: 1 },
          pro_yearly: { plan: "pro", months: 12 },
          premium_monthly: { plan: "premium", months: 1 },
          premium_yearly: { plan: "premium", months: 12 },
        };

        const { plan, months } = planMap[planId] || { plan: "pro", months: 1 };
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + months);

        await User.findOneAndUpdate(
          { clerkId: userId },
          {
            "subscription.plan": plan,
            "subscription.status": "active",
            "subscription.startDate": new Date(),
            "subscription.expiresAt": expiresAt,
          }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
