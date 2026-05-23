import Link from "next/link";
import {
  Brain,
  CreditCard,
  Calendar,
  Upload,
  ArrowRight,
  TrendingUp,
  Target,
} from "lucide-react";
import UserGreeting from "@/components/dashboard/UserGreeting";

const quickActions = [
  {
    icon: Upload,
    label: "Upload & Generate",
    desc: "Create MCQs from your notes",
    href: "/upload",
    color: "from-violet-600/20 to-violet-600/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Brain,
    label: "Start Quiz",
    desc: "AI-generated practice questions",
    href: "/quiz",
    color: "from-blue-600/20 to-blue-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: CreditCard,
    label: "Flashcards",
    desc: "Review today's due cards",
    href: "/flashcards",
    color: "from-emerald-600/20 to-emerald-600/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Calendar,
    label: "Revision Schedule",
    desc: "See what to study today",
    href: "/scheduler",
    color: "from-orange-600/20 to-orange-600/10",
    border: "border-orange-500/20",
    iconColor: "text-orange-400",
  },
];

export default async function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome header */}
      <div>
        <UserGreeting />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Day Streak", value: "0", icon: "🔥", color: "text-orange-400" },
          { label: "XP Points", value: "0", icon: "⚡", color: "text-violet-400" },
          { label: "Quizzes Done", value: "0", icon: "🧠", color: "text-blue-400" },
          { label: "Accuracy", value: "—", icon: "🎯", color: "text-emerald-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs font-medium">{stat.label}</span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Today's revision queue */}
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Calendar size={18} className="text-violet-400" />
            Today&apos;s Revision Queue
          </h2>
          <Link href="/scheduler" className="text-violet-400 text-sm hover:text-violet-300 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-600 text-sm">No revisions scheduled for today.</p>
          <Link
            href="/upload"
            className="mt-4 inline-flex items-center gap-2 btn-brand px-5 py-2.5 rounded-xl text-sm"
          >
            <Upload size={16} />
            Upload your first notes
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
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
          <div className="text-center py-6">
            <p className="text-slate-600 text-sm">
              Complete some quizzes to see your weak topics here.
            </p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-bold flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald-400" />
            Recent Activity
          </h2>
          <div className="text-center py-6">
            <p className="text-slate-600 text-sm">
              Your revision history will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
