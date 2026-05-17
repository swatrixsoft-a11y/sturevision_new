import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RevisionSession } from "@/models/RevisionSession";
import { isDueToday } from "@/utils/spaced-repetition";

// GET — fetch the user's full revision queue
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all"; // all | today | upcoming

    await connectDB();

    const query: Record<string, unknown> = { userId, isCompleted: true };

    const sessions = await RevisionSession.find(query)
      .sort({ nextRevisionDate: 1 })
      .limit(100)
      .select("subject chapter score accuracy revisionCycle nextRevisionDate completedAt");

    const items = sessions.map((s) => ({
      id: s._id,
      subject: s.subject,
      chapter: s.chapter,
      cycle: s.revisionCycle,
      score: s.score,
      accuracy: s.accuracy,
      nextRevisionDate: s.nextRevisionDate,
      daysLeft: Math.max(0, Math.ceil(
        (new Date(s.nextRevisionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )),
      isDueToday: isDueToday(new Date(s.nextRevisionDate)),
    }));

    const filtered =
      filter === "today" ? items.filter((i) => i.isDueToday) :
      filter === "upcoming" ? items.filter((i) => !i.isDueToday) :
      items;

    return NextResponse.json({
      items: filtered,
      todayCount: items.filter((i) => i.isDueToday).length,
      upcomingCount: items.filter((i) => !i.isDueToday).length,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
