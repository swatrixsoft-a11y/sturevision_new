// Called after Clerk sign-up to create the user in MongoDB
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await connectDB();

    // Upsert user
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $setOnInsert: {
          clerkId: userId,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Student",
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          avatar: clerkUser.imageUrl,
          referralCode: generateReferralCode(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ user: user.toObject() });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
