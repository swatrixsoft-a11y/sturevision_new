import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ plan: "free", status: "active" });

    await connectDB();
    const user = await User.findOne({ clerkId: userId }).select("subscription").lean();

    if (!user) return NextResponse.json({ plan: "free", status: "active" });

    const sub = (user as any).subscription || {};
    const isExpired = sub.expiresAt && new Date(sub.expiresAt) < new Date();

    return NextResponse.json({
      plan: sub.plan || "free",
      status: isExpired ? "expired" : (sub.status || "active"),
      expiresAt: sub.expiresAt,
    });
  } catch {
    return NextResponse.json({ plan: "free", status: "active" });
  }
}
