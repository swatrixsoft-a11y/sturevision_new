import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { generateMCQs } from "@/lib/openai";
import { AIQuestion } from "@/models/AIQuestion";
import { RevisionSession } from "@/models/RevisionSession";
import { User } from "@/models/User";
import { getNextRevisionDate } from "@/utils/spaced-repetition";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content, subject, chapter, count = 10, difficulty = "medium" } = await req.json();

    if (!content || !subject || !chapter) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // Generate questions via AI (with caching)
    const questions = await generateMCQs(content, subject, chapter, count, difficulty);

    if (!questions.length) {
      return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }

    // Save questions to DB for reuse
    const savedQuestions = await AIQuestion.insertMany(
      questions.map((q) => ({
        subject,
        chapter,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        topic: q.topic,
        board: "CBSE",
      }))
    );

    // Create a revision session
    const session = await RevisionSession.create({
      userId,
      subject,
      chapter,
      questions: savedQuestions.map((q) => ({
        questionId: q._id.toString(),
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        topic: q.topic,
      })),
      nextRevisionDate: getNextRevisionDate(1),
      revisionCycle: 1,
    });

    return NextResponse.json({
      sessionId: session._id,
      questions: questions,
      total: questions.length,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
