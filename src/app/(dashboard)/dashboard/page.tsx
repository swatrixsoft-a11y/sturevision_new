import Link from "next/link";
import {
  Brain,
  CreditCard,
  Calendar,
  Upload,
  ArrowRight,
  TrendingUp,
  Target,
  AlertTriangle,
  BookOpen,
  Zap,
  Trophy,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { RevisionSession } from "@/models/RevisionSession";
import { Flashcard } from "@/models/Flashcard";
import { isDueToday } from "@/utils/spaced-repetition";
import UserGreeting from "@/components/dashboard/UserGreeting";

const SUBJECT_EMOJIS: Record<string, string> = {
  Physics: "⚛️", Chemistry: "🧪", Mathematics: "📐",
  Math: "📐", Biology: "🌿", History: "📜",
  Geography: "🗺️", English: "📝", Science: "🔬",
  "Computer Science": "💻",
};

function subjectEmoji(subject: string) {
  return SUBJECT_EMOJIS[subject] || "📚";
}

function timeAgo(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── New-user onboarding ───────────────────────────────────────────────────

function OnboardingGuide() {
  const steps = [
    {
      step: "1",
      icon: Upload,
      color: "from-violet-600/20 to-violet-600/5 border-violet-500/20",
      iconColor: "text-violet-400",
      title: "Upload your notes",
      desc: "Upload a PDF or paste your chapter notes. Our AI reads everything.",
      href: "/upload",
      cta: "Upload now →",
    },
    {
      step: "2",
      icon: Brain,
      color: "from-blue-600/20 to-blue-600/5 border-blue-500/20",
      iconColor: "text-blue-400",
      title: "AI generates content",
      desc: "Automatically creates MCQ quizzes and flashcards from your material.",
      href: "/upload",
      cta: "See how →",
    },
    {
      step: "3",
      icon: CreditCard,
      color: "from-emerald-600/20 to-emerald-600/5 border-emerald-500/20",
      iconColor: "text-emerald-400",
      title: "Study & revise",
      desc: "Review flashcards with spaced repetition. Take quizzes to test recall.",
      href: "/flashcards",
      cta: "Try flashcards →",
    },
    {
      step: "4",
      icon: Trophy,
      color: "from-orange-600/20 to-orange-600/5 border-orange-500/20",
      iconColor: "text-orange-400",
      title: "Track your progress",
      desc: "Streak, XP and accuracy stats grow as you revise. Compete on the leaderboard.",
      href: "/analytics",
      cta: "View analytics →",
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-violet-500/10 bg-gradient-to-br from-violet-900/10 to-transparent">
      <div className="mb-6">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <BookOpen size={18} className="text-violet-400" />
          Welcome! Here&apos;s how Sturevision works
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Follow these 4 steps to start revising smarter — not harder.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => (
          <Link
            key={s.step}
            href={s.href}
            className={`group relative p-5 rounded-2xl bg-gradient-to-br ${s.color} border hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-white">
                {s.step}
              </span>
              <s.icon size={18} className={s.iconColor} />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">{s.title}</h3>
            <p className="text-slate-500 text-xs mb-3 leading-relaxed">{s.desc}</p>
            <span className="text-xs font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
              {s.cta}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Subject overview ───────────────────────────────────────────────────────

function SubjectOverview({
  sessions,
}: {
  sessions: Array<{ subject: string; count: number; avgAccuracy: number }>;
}) {
  if (sessions.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5">
      <h2 className="text-white font-bold flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-blue-400" />
        Your Active Subjects
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sessions.map((s) => (
          <Link
            key={s.subject}
            href="/quiz"
            className="p-4 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all group"
          >
            <div className="text-2xl mb-2">{subjectEmoji(s.subject)}</div>
            <p className="text-white font-semibold text-sm truncate">{s.subject}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.count} session{s.count !== 1 ? "s" : ""}</p>
            <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                style={{ width: `${s.avgAccuracy}%` }}
              />
            </div>
            <p className="text-xs mt-1 font-semibold" style={{ color: s.avgAccuracy >= 70 ? "#34d399" : "#f97316" }}>
              {s.avgAccuracy}% avg accuracy
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  let user: any = null;
  let recentSessions: any[] = [];
  let flashcardsDue = 0;
  let totalSessions = 0;
  let avgAccuracy = 0;
  let totalFlashcards = 0;
  let subjectStats: Array<{ subject: string; count: number; avgAccuracy: number }> = [];

  try {
    await connectDB();

    [user, recentSessions, flashcardsDue, totalFlashcards] = await Promise.all([
      User.findOne({ clerkId: userId }).lean(),
      RevisionSession.find({ userId, isCompleted: true })
        .sort({ completedAt: -1 })
        .limit(5)
        .select("subject chapter accuracy score completedAt xpEarned")
        .lean(),
      Flashcard.countDocuments({ userId, nextReviewDate: { $lte: new Date() } }),
      Flashcard.countDocuments({ userId }),
    ]);

    totalSessions = await RevisionSession.countDocuments({ userId, isCompleted: true });

    const last20 = await RevisionSession.find({ userId, isCompleted: true })
      .sort({ completedAt: -1 })
      .limit(20)
      .select("accuracy")
      .lean();
    avgAccuracy = last20.length
      ? Math.round(last20.reduce((acc: number, s: any) => acc + s.accuracy, 0) / last20.length)
      : 0;

    // Build per-subject stats
    const subjectAgg = await RevisionSession.aggregate([
      { $match: { userId, isCompleted: true } },
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 },
          avgAccuracy: { $avg: "$accuracy" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);
    subjectStats = subjectAgg.map((s: any) => ({
      subject: s._id,
      count: s.count,
      avgAccuracy: Math.round(s.avgAccuracy),
    }));
  } catch (err) {
    console.error("Dashboard page DB error:", err);
  }

  const isNewUser = totalSessions === 0 && totalFlashcards === 0;

  const revisionsDueToday = (user?.revisionQueue || []).filter(
    (item: { nextRevisionDate: Date }) => isDueToday(new Date(item.nextRevisionDate))
  ) as Array<{ sessionId: string; subject: string; chapter: string; cycle: number; score: number }>;

  const stats = [
    {
      label: "Day Streak",
      value: String(user?.streakCount ?? 0),
      icon: "🔥",
      color: "text-orange-400",
      subtext: (user?.streakCount ?? 0) > 0 ? `Best: ${user?.longestStreak ?? 0}` : "Do a quiz to start",
    },
    {
      label: "XP Points",
      value: (user?.xpPoints ?? 0).toLocaleString(),
      icon: "⚡",
      color: "text-violet-400",
      subtext: `Level ${user?.level ?? 1}`,
    },
    {
      label: "Quizzes Done",
      value: String(totalSessions),
      icon: "🧠",
      color: "text-blue-400",
      subtext: totalSessions > 0 ? `${totalFlashcards} flashcards` : "Upload notes to begin",
    },
    {
      label: "Accuracy",
      value: avgAccuracy > 0 ? `${avgAccuracy}%` : "—",
      icon: "🎯",
      color: "text-emerald-400",
      subtext: avgAccuracy > 0 ? (avgAccuracy >= 80 ? "Excellent!" : avgAccuracy >= 60 ? "Keep going!" : "Needs work") : "Accuracy shows after quizzes",
    },
  ];

  const weakTopics = (user?.weakTopics || []).slice(0, 5) as Array<{
    subject: string;
    topic: string;
    accuracy: number;
  }>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome header */}
      <UserGreeting />

      {/* Onboarding for new users */}
      {isNewUser && <OnboardingGuide />}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs font-medium">{stat.label}</span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <p className="text-slate-600 text-[11px] mt-1.5">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Flashcard + Quick-start CTAs for new users */}
      {!isNewUser && flashcardsDue > 0 && (
        <Link
          href="/flashcards"
          className="flex items-center justify-between p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🃏</span>
            <div>
              <p className="text-white font-bold text-sm">
                {flashcardsDue} flashcard{flashcardsDue !== 1 ? "s" : ""} due for review
              </p>
              <p className="text-slate-500 text-xs">Spaced repetition keeps your memory sharp</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {/* Today's revision queue */}
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Calendar size={18} className="text-violet-400" />
            Today&apos;s Revision Queue
            {revisionsDueToday.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                {revisionsDueToday.length} due
              </span>
            )}
          </h2>
          <Link
            href="/scheduler"
            className="text-violet-400 text-sm hover:text-violet-300 flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {revisionsDueToday.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600 text-sm">
              {totalSessions > 0
                ? "🎉 All caught up! No revisions due today."
                : "No revisions scheduled yet. Upload notes to get started."}
            </p>
            {totalSessions === 0 && (
              <Link
                href="/upload"
                className="mt-4 inline-flex items-center gap-2 btn-brand px-5 py-2.5 rounded-xl text-sm"
              >
                <Upload size={16} />
                Upload your first notes
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {revisionsDueToday.slice(0, 5).map((item) => (
              <div
                key={item.sessionId}
                className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-violet-500/10 hover:border-violet-500/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{subjectEmoji(item.subject)}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.chapter}</p>
                    <p className="text-slate-500 text-xs">
                      {item.subject} · Cycle {item.cycle} · Last score:{" "}
                      <span className={item.score >= 70 ? "text-emerald-400" : "text-orange-400"}>
                        {item.score}%
                      </span>
                    </p>
                  </div>
                </div>
                <Link
                  href="/quiz"
                  className="btn-brand px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  <Brain size={12} /> Revise
                </Link>
              </div>
            ))}
            {revisionsDueToday.length > 5 && (
              <Link
                href="/scheduler"
                className="block text-center text-violet-400 text-sm py-2 hover:text-violet-300"
              >
                +{revisionsDueToday.length - 5} more →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Subject overview — only when user has data */}
      {subjectStats.length > 0 && <SubjectOverview sessions={subjectStats} />}

      {/* Quick actions */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Zap size={18} className="text-violet-400" />
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Upload, label: "Upload & Generate", desc: "Create MCQs + flashcards from your notes",
              href: "/upload", color: "from-violet-600/20 to-violet-600/10",
              border: "border-violet-500/20", iconColor: "text-violet-400",
            },
            {
              icon: Brain, label: "Start Quiz", desc: "AI-generated practice questions",
              href: "/quiz", color: "from-blue-600/20 to-blue-600/10",
              border: "border-blue-500/20", iconColor: "text-blue-400",
            },
            {
              icon: CreditCard, label: "Flashcards", desc: `Review ${flashcardsDue > 0 ? `${flashcardsDue} cards due today` : "your flashcard deck"}`,
              href: "/flashcards", color: "from-emerald-600/20 to-emerald-600/10",
              border: "border-emerald-500/20", iconColor: "text-emerald-400",
            },
            {
              icon: Calendar, label: "Revision Schedule", desc: "See what to study today",
              href: "/scheduler", color: "from-orange-600/20 to-orange-600/10",
              border: "border-orange-500/20", iconColor: "text-orange-400",
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`group relative p-5 rounded-2xl bg-gradient-to-br ${action.color} border ${action.border} hover:scale-[1.02] transition-all duration-200`}
            >
              <action.icon size={24} className={`${action.iconColor} mb-3`} />
              <h3 className="text-white font-bold text-sm mb-1">{action.label}</h3>
              <p className="text-slate-500 text-xs">{action.desc}</p>
              <ArrowRight
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Progress overview */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Weak topics */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-bold flex items-center gap-2 mb-4">
            <Target size={18} className="text-red-400" />
            Weak Topics
          </h2>
          {weakTopics.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-600 text-sm">
                {totalSessions > 0
                  ? "Great job — no weak topics identified yet!"
                  : "Complete some quizzes to see your weak topics here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {weakTopics.map((t, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10"
                >
                  <AlertTriangle size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{t.topic}</p>
                    <p className="text-slate-500 text-xs">{t.subject}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-orange-400 font-bold text-sm">{t.accuracy}%</span>
                    <Link
                      href="/quiz"
                      className="block text-[10px] text-violet-400 hover:text-violet-300 mt-0.5"
                    >
                      Retry →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-bold flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald-400" />
            Recent Activity
          </h2>
          {recentSessions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-600 text-sm">Your revision history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((s: any) => (
                <div key={s._id?.toString()} className="flex items-center gap-3">
                  <span className="text-lg flex-shrink-0">{subjectEmoji(s.subject)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{s.chapter}</p>
                    <p className="text-slate-500 text-xs">
                      {s.subject} · {timeAgo(new Date(s.completedAt))}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-sm font-bold ${
                        s.accuracy >= 70 ? "text-emerald-400" : "text-orange-400"
                      }`}
                    >
                      {s.accuracy}%
                    </p>
                    <p className="text-slate-600 text-xs">+{s.xpEarned ?? 0} XP</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
