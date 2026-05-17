import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Flashcard } from "@/models/Flashcard";
import { calculateNextReview, type Rating } from "@/utils/spaced-repetition";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { rating } = await req.json() as { rating: Rating };

    if (rating === undefined || rating < 0 || rating > 3) {
      return NextResponse.json({ error: "Rating must be 0-3" }, { status: 400 });
    }

    await connectDB();

    const card = await Flashcard.findById(id);
    if (!card || card.userId !== userId) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const updated = calculateNextReview(
      {
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetitions: card.repetitions,
        nextReviewDate: card.nextReviewDate,
      },
      rating
    );

    card.easeFactor = updated.easeFactor;
    card.interval = updated.interval;
    card.repetitions = updated.repetitions;
    card.nextReviewDate = updated.nextReviewDate;
    card.reviewHistory.push({ rating, reviewedAt: new Date() });
    await card.save();

    return NextResponse.json({
      nextReviewDate: updated.nextReviewDate,
      interval: updated.interval,
      easeFactor: updated.easeFactor,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
