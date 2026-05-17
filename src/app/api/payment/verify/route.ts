import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId } = await req.json();

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const planMap: Record<string, { plan: string; months: number }> = {
      pro_monthly: { plan: "pro", months: 1 },
      pro_yearly: { plan: "pro", months: 12 },
      premium_monthly: { plan: "premium", months: 1 },
      premium_yearly: { plan: "premium", months: 12 },
    };
    const { plan, months } = planMap[planId] || { plan: "pro", months: 1 };
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    await connectDB();
    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        "subscription.plan": plan,
        "subscription.status": "active",
        "subscription.startDate": new Date(),
        "subscription.expiresAt": expiresAt,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
