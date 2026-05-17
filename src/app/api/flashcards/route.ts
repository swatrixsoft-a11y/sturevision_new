import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Flashcard } from "@/models/Flashcard";
import { generateFlashcards } from "@/lib/openai";

// GET — fetch user's flashcards (optionally filter by subject / due today)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const dueOnly = searchParams.get("due") === "true";

    await connectDB();

    const query: Record<string, unknown> = { userId };
    if (subject) query.subject = subject;
    if (dueOnly) query.nextReviewDate = { $lte: new Date() };

    const cards = await Flashcard.find(query).sort({ nextReviewDate: 1 }).limit(50);

    return NextResponse.json({ cards, total: cards.length });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create flashcards (manually or AI-generated)
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { subject, chapter, content, count = 15, cards: manualCards } = body;

    await connectDB();

    let cardData: Array<{ front: string; back: string; topic: string; difficulty: string }> = [];

    if (manualCards?.length) {
      // Manually provided cards
      cardData = manualCards;
    } else if (content) {
      // AI-generated
      cardData = await generateFlashcards(content, subject, count);
    } else {
      return NextResponse.json({ error: "Provide content or cards" }, { status: 400 });
    }

    const created = await Flashcard.insertMany(
      cardData.map((c) => ({
        userId,
        subject,
        chapter,
        front: c.front,
        back: c.back,
        difficulty: c.difficulty || "medium",
        aiGenerated: !manualCards,
        nextReviewDate: new Date(),
      }))
    );

    return NextResponse.json({ cards: created, total: created.length });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
