import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RevisionSession } from "@/models/RevisionSession";
import { User } from "@/models/User";
import { getNextRevisionDate } from "@/utils/spaced-repetition";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId, answers, timeTaken } = await req.json();

    await connectDB();

    const session = await RevisionSession.findById(sessionId);
    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Grade answers
    let correct = 0;
    const gradedQuestions = session.questions.map((q: any, i: number) => {
      const userAnswer = answers[i] ?? -1;
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correct++;
      return { ...q.toObject(), userAnswer, isCorrect, timeTaken: timeTaken?.[i] || 0 };
    });

    const score = correct;
    const accuracy = Math.round((correct / session.questions.length) * 100);

    // Identify weak topics
    const wrongTopics = gradedQuestions
      .filter((q: any) => !q.isCorrect && q.topic)
      .map((q: any) => q.topic);
    const weakTopics = [...new Set(wrongTopics)] as string[];

    // XP calculation
    const xpEarned = Math.round(accuracy * 0.5) + (accuracy === 100 ? 50 : 0);

    // Determine next revision cycle
    const nextCycle = Math.min(session.revisionCycle + 1, 5);
    const nextRevisionDate = getNextRevisionDate(nextCycle);

    // Update session
    await RevisionSession.findByIdAndUpdate(sessionId, {
      questions: gradedQuestions,
      score,
      accuracy,
      timeTaken,
      weakTopicsIdentified: weakTopics,
      nextRevisionDate,
      revisionCycle: nextCycle,
      completedAt: new Date(),
      isCompleted: true,
      xpEarned,
    });

    // Update user stats
    const user = await User.findOne({ clerkId: userId });
    if (user) {
      user.addXP(xpEarned);
      user.updateStreak();

      // Update weak topics
      for (const topic of weakTopics) {
        const existing = user.weakTopics.find(
          (wt: any) => wt.topic === topic && wt.subject === session.subject
        );
        if (existing) {
          existing.accuracy = Math.round(
            (existing.accuracy * existing.attempts + (isCorrectTopic(topic, gradedQuestions) ? 100 : 0)) /
              (existing.attempts + 1)
          );
          existing.attempts += 1;
          existing.lastAttempted = new Date();
        } else {
          user.weakTopics.push({
            subject: session.subject,
            topic,
            accuracy: 0,
            attempts: 1,
            lastAttempted: new Date(),
          });
        }
      }

      // Add to revision queue
      user.revisionQueue.push({
        sessionId,
        subject: session.subject,
        chapter: session.chapter,
        nextRevisionDate,
        cycle: nextCycle,
        score,
      });

      await user.save();
    }

    return NextResponse.json({
      score,
      accuracy,
      xpEarned,
      weakTopics,
      nextRevisionDate,
      gradedQuestions,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function isCorrectTopic(topic: string, questions: any[]): boolean {
  const topicQuestions = questions.filter((q) => q.topic === topic);
  return topicQuestions.every((q) => q.isCorrect);
}
