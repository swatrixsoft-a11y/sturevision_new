import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { RevisionSession } from "@/models/RevisionSession";
import { Flashcard } from "@/models/Flashcard";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const [user, sessionCount, flashcardCount] = await Promise.all([
      User.findOne({ clerkId: userId }).select(
        "name email grade board subjects xpPoints level streakCount subscription"
      ),
      RevisionSession.countDocuments({ userId, isCompleted: true }),
      Flashcard.countDocuments({ userId }),
    ]);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      grade: user.grade || "10",
      board: user.board || "CBSE",
      subjects: user.subjects || [],
      xpPoints: user.xpPoints || 0,
      level: user.level || 1,
      streakCount: user.streakCount || 0,
      plan: user.subscription?.plan || "free",
      planStatus: user.subscription?.status || "active",
      sessionCount,
      flashcardCount,
    });
  } catch (err) {
    console.error("Profile GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { grade, board, subjects } = body;

    if (subjects && (!Array.isArray(subjects) || subjects.length > 6)) {
      return NextResponse.json({ error: "Invalid subjects" }, { status: 400 });
    }

    await connectDB();

    const updated = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { ...(grade && { grade }), ...(board && { board }), ...(subjects && { subjects }) } },
      { new: true }
    ).select("grade board subjects");

    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      grade: updated.grade,
      board: updated.board,
      subjects: updated.subjects,
    });
  } catch (err) {
    console.error("Profile PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
