import { auth } from "@clerk/nextjs/server";
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
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId } =
      await req.json();

    // Verify Razorpay signature
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const { plan, months } = PLAN_MAP[planId] || { plan: "pro", months: 1 };
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    await connectDB();

    // Save payment transaction record
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        userId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        planId,
        plan,
        amount: months === 1 ? (plan === "pro" ? 9900 : 49900) : (plan === "pro" ? 99900 : 299900),
        currency: "INR",
        status: "captured",
        expiresAt,
      },
      { upsert: true, new: true }
    );

    // Update user subscription — upsert so it works even if user doc is missing
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
