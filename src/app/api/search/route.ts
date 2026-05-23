import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Flashcard } from "@/models/Flashcard";
import { RevisionSession } from "@/models/RevisionSession";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  if (q.length < 2) return NextResponse.json({ flashcards: [], sessions: [] });

  await connectDB();

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const [flashcards, sessions] = await Promise.all([
    Flashcard.find({
      userId,
      $or: [{ front: regex }, { subject: regex }],
    })
      .limit(5)
      .select("front subject difficulty")
      .lean(),

    RevisionSession.find({
      userId,
      isCompleted: true,
      $or: [{ chapter: regex }, { subject: regex }],
    })
      .sort({ completedAt: -1 })
      .limit(5)
      .select("subject chapter accuracy completedAt")
      .lean(),
  ]);

  return NextResponse.json({ flashcards, sessions });
}
