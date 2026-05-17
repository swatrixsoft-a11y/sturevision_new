import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { RevisionSession } from "@/models/RevisionSession";
import { Flashcard } from "@/models/Flashcard";
import { isDueToday } from "@/utils/spaced-repetition";

// GET — user dashboard stats
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const [user, sessions, flashcardsDue] = await Promise.all([
      User.findOne({ clerkId: userId }),
      RevisionSession.find({ userId, isCompleted: true }).sort({ completedAt: -1 }).limit(10),
      Flashcard.countDocuments({ userId, nextReviewDate: { $lte: new Date() } }),
    ]);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const totalSessions = await RevisionSession.countDocuments({ userId, isCompleted: true });
    const avgAccuracy = sessions.length
      ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length)
      : 0;

    const revisionsDueToday = user.revisionQueue.filter((item: { nextRevisionDate: Date }) =>
      isDueToday(new Date(item.nextRevisionDate))
    ).length;

    return NextResponse.json({
      streakCount: user.streakCount,
      longestStreak: user.longestStreak,
      xpPoints: user.xpPoints,
      level: user.level,
      totalSessions,
      avgAccuracy,
      flashcardsDue,
      revisionsDueToday,
      weakTopics: user.weakTopics.slice(0, 5),
      recentSessions: sessions.slice(0, 5).map((s) => ({
        id: s._id,
        subject: s.subject,
        chapter: s.chapter,
        accuracy: s.accuracy,
        score: s.score,
        completedAt: s.completedAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
