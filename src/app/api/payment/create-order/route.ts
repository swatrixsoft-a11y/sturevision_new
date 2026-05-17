import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const PLANS = {
  pro_monthly: { amount: 19900, currency: "INR", description: "Student Pro – Monthly" },
  pro_yearly: { amount: 99900, currency: "INR", description: "Student Pro – Yearly" },
  premium_monthly: { amount: 49900, currency: "INR", description: "Premium AI – Monthly" },
  premium_yearly: { amount: 299900, currency: "INR", description: "Premium AI – Yearly" },
} as const;

type PlanId = keyof typeof PLANS;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { planId } = await req.json() as { planId: PlanId };

    if (!PLANS[planId]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = PLANS[planId];

    // Dynamically import Razorpay to avoid build issues when key is missing
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      notes: { userId, planId },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: plan.amount,
      currency: plan.currency,
      description: plan.description,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment order error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
