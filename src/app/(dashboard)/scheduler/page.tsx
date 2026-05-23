"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Brain, ArrowRight, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

const REVISION_CYCLE_LABELS = ["", "Day 1", "Day 3", "Day 7", "Day 15", "Final"];

const SUBJECT_EMOJIS: Record<string, string> = {
  Physics: "⚛️", Chemistry: "🧪", Mathematics: "📐",
  Math: "📐", Biology: "🌿", History: "📜",
  Geography: "🗺️", English: "📝", Science: "🔬",
};

function subjectEmoji(subject: string) {
  return SUBJECT_EMOJIS[subject] || "📚";
}

interface RevisionItem {
  id: string;
  subject: string;
  chapter: string;
  cycle: number;
  score: number;
  accuracy: number;
  nextRevisionDate: string;
  daysLeft: number;
  isDueToday: boolean;
}

export default function SchedulerPage() {
  const [items, setItems] = useState<RevisionItem[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "today" | "upcoming">("all");

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setTodayCount(d.todayCount || 0);
        setUpcomingCount(d.upcomingCount || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = items.filter((i) => i.isDueToday);
  const upcoming = items.filter((i) => !i.isDueToday);
  const displayed = filter === "today" ? today : filter === "upcoming" ? upcoming : items;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Revision Scheduler</h1>
          <p className="text-slate-500 text-sm">Your AI-powered spaced repetition schedule</p>
        </div>
        <Link href="/upload" className="btn-brand px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 w-fit">
          + Add Topic
        </Link>
      </div>

      {/* Today's summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: "🔴", label: "Due Today", value: todayCount, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          { icon: "📅", label: "Upcoming", value: upcomingCount, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { icon: "📚", label: "Total Topics", value: items.length, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 border ${s.bg} text-center`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-black ${s.color}`}>{loading ? "—" : s.value}</div>
            <div className="text-slate-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Spaced repetition explainer */}
      <div className="glass-card rounded-2xl p-5 border border-white/5">
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <Brain size={16} className="text-violet-400" />
          Your AI Memory Engine
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { day: "Today", icon: "📖", desc: "Study" },
            { day: "Day 1", icon: "🔁", desc: "Reinforce" },
            { day: "Day 3", icon: "🧠", desc: "Stabilize" },
            { day: "Day 7", icon: "💪", desc: "Long-term" },
            { day: "Day 15", icon: "🏆", desc: "Exam ready" },
          ].map((step, i) => (
            <div key={step.day} className="flex items-center gap-2 flex-shrink-0">
              <div className="text-center px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-base">{step.icon}</div>
                <div className="text-xs font-bold text-white mt-0.5">{step.day}</div>
                <div className="text-xs text-slate-600">{step.desc}</div>
              </div>
              {i < 4 && <ArrowRight size={12} className="text-slate-700 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-violet-400 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 border border-white/5 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-2xl font-black text-white mb-2">Nothing scheduled yet</h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            Upload your notes, generate a quiz, and complete it — your revision schedule will be built automatically.
          </p>
          <Link href="/upload" className="inline-flex items-center gap-2 btn-brand px-6 py-3 rounded-xl font-bold text-sm">
            <Upload size={16} /> Upload Notes
          </Link>
        </div>
      ) : (
        <>
          {/* Filter tabs */}
          <div className="flex gap-2">
            {(["all", "today", "upcoming"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all",
                  filter === f
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                    : "text-slate-500 border border-white/5 hover:border-white/10 hover:text-slate-300"
                )}
              >
                {f === "all" ? `All (${items.length})` : f === "today" ? `Today (${today.length})` : `Upcoming (${upcoming.length})`}
              </button>
            ))}
          </div>

          {/* Revision queue */}
          {displayed.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 border border-white/5 text-center">
              <div className="text-4xl mb-3">{filter === "today" ? "🎉" : "📅"}</div>
              <p className="text-slate-400">
                {filter === "today" ? "All caught up for today!" : "No upcoming revisions."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayed.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "glass-card rounded-2xl p-5 border transition-all hover:border-white/10 group",
                    item.isDueToday ? "border-violet-500/15" : "border-white/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Subject badge */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/5">
                        <span className="text-lg">{subjectEmoji(item.subject)}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-white font-bold text-sm">{item.chapter}</span>
                          <span className="text-slate-600 text-xs">•</span>
                          <span className="text-slate-500 text-xs">{item.subject}</span>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            item.isDueToday
                              ? "bg-violet-500/15 text-violet-300 border-violet-500/25"
                              : "bg-white/5 text-slate-500 border-white/10"
                          }`}>
                            {REVISION_CYCLE_LABELS[item.cycle] || `Cycle ${item.cycle}`} revision
                          </span>
                          <span className="text-xs text-slate-600">
                            {item.isDueToday ? "🔴 Due today" : `⏰ In ${item.daysLeft} day${item.daysLeft !== 1 ? "s" : ""}`}
                          </span>
                          <span className="text-xs text-slate-600">
                            Last score:{" "}
                            <span className={item.accuracy >= 70 ? "text-emerald-400" : "text-orange-400"}>
                              {item.accuracy}%
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.isDueToday && (
                      <Link
                        href="/quiz"
                        className="btn-brand px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Brain size={14} /> Revise
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
