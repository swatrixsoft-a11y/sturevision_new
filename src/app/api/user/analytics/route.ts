import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RevisionSession } from "@/models/RevisionSession";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "7d";

    await connectDB();

    const daysAgo = period === "7d" ? 7 : period === "30d" ? 30 : 365;
    const since = new Date();
    since.setDate(since.getDate() - daysAgo);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [user, dailyStats, subjectStats, activityRaw, totals] = await Promise.all([
      User.findOne({ clerkId: userId }).select("streakCount longestStreak xpPoints level"),
      RevisionSession.aggregate([
        { $match: { userId, isCompleted: true, completedAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
            accuracy: { $avg: "$accuracy" },
            xp: { $sum: "$xpEarned" },
            sessions: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      RevisionSession.aggregate([
        { $match: { userId, isCompleted: true } },
        {
          $group: {
            _id: "$subject",
            accuracy: { $avg: "$accuracy" },
            sessions: { $sum: 1 },
          },
        },
        { $sort: { sessions: -1 } },
        { $limit: 8 },
      ]),
      RevisionSession.aggregate([
        { $match: { userId, isCompleted: true, completedAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
            xp: { $sum: "$xpEarned" },
            sessions: { $sum: 1 },
          },
        },
      ]),
      RevisionSession.aggregate([
        { $match: { userId, isCompleted: true } },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            avgAccuracy: { $avg: "$accuracy" },
          },
        },
      ]),
    ]);

    // Build filled 30-day activity heatmap
    const activityMap: Record<string, { xp: number; sessions: number }> = {};
    for (const item of activityRaw) {
      activityMap[item._id] = { xp: item.xp, sessions: item.sessions };
    }
    const activityHeatmap = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().split("T")[0];
      return {
        date: key,
        day: i + 1,
        xp: activityMap[key]?.xp || 0,
        sessions: activityMap[key]?.sessions || 0,
        active: !!activityMap[key],
      };
    });

    // Build filled daily stats for the requested period (no gaps in chart)
    const dailyMap: Record<string, { accuracy: number; xp: number; sessions: number }> = {};
    for (const d of dailyStats) {
      dailyMap[d._id] = { accuracy: Math.round(d.accuracy || 0), xp: d.xp || 0, sessions: d.sessions || 0 };
    }
    const filledDailyStats = Array.from({ length: daysAgo }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (daysAgo - 1 - i));
      const key = d.toISOString().split("T")[0];
      const label =
        daysAgo <= 7
          ? d.toLocaleDateString("en-US", { weekday: "short" })
          : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return {
        day: label,
        date: key,
        accuracy: dailyMap[key]?.accuracy || 0,
        xp: dailyMap[key]?.xp || 0,
        sessions: dailyMap[key]?.sessions || 0,
      };
    });

    const totalsData = totals[0] || { totalSessions: 0, avgAccuracy: 0 };

    return NextResponse.json({
      kpis: {
        avgAccuracy: Math.round(totalsData.avgAccuracy || 0),
        totalXP: user?.xpPoints || 0,
        totalSessions: totalsData.totalSessions || 0,
        longestStreak: user?.longestStreak || 0,
        level: user?.level || 1,
      },
      dailyStats: filledDailyStats,
      subjectStats: subjectStats.map((s) => ({
        subject: s._id || "Unknown",
        accuracy: Math.round(s.accuracy || 0),
        sessions: s.sessions || 0,
      })),
      activityHeatmap,
    });
  } catch (err) {
    console.error("Analytics API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
