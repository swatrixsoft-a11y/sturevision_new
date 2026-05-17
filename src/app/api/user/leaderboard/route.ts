import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

// GET — fetch leaderboard (top 50 users by XP)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "global"; // global | weekly

    await connectDB();

    const leaders = await User.find({})
      .sort({ xpPoints: -1 })
      .limit(50)
      .select("clerkId name avatar xpPoints streakCount level");

    const ranked = leaders.map((u, i) => ({
      rank: i + 1,
      userId: u.clerkId,
      name: u.name,
      avatar: u.avatar,
      xpPoints: u.xpPoints,
      streakCount: u.streakCount,
      level: u.level,
      isCurrentUser: u.clerkId === userId,
    }));

    // Find current user's rank if not in top 50
    const myRank = ranked.find((r) => r.isCurrentUser);
    let myPosition = null;
    if (!myRank) {
      const myUser = await User.findOne({ clerkId: userId }).select("xpPoints name level streakCount");
      if (myUser) {
        const aboveMe = await User.countDocuments({ xpPoints: { $gt: myUser.xpPoints } });
        myPosition = {
          rank: aboveMe + 1,
          userId,
          name: myUser.name,
          xpPoints: myUser.xpPoints,
          streakCount: myUser.streakCount,
          level: myUser.level,
          isCurrentUser: true,
        };
      }
    }

    return NextResponse.json({ leaders: ranked, myPosition });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
