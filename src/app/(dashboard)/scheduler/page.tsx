"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, Brain, ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

const REVISION_CYCLE_LABELS = ["", "Day 1", "Day 3", "Day 7", "Day 15", "Final"];
const CYCLE_COLORS = ["", "violet", "blue", "emerald", "orange", "red"];

interface RevisionItem {
  id: string;
  subject: string;
  chapter: string;
  cycle: number;
  score: number;
  dueDate: Date;
  daysLeft: number;
}

// Sample data — replace with real API data
const SAMPLE_ITEMS: RevisionItem[] = [
  { id: "1", subject: "Physics", chapter: "Laws of Motion", cycle: 2, score: 80, dueDate: new Date(), daysLeft: 0 },
  { id: "2", subject: "Chemistry", chapter: "Periodic Table", cycle: 1, score: 65, dueDate: new Date(), daysLeft: 0 },
  { id: "3", subject: "Mathematics", chapter: "Integration", cycle: 3, score: 90, dueDate: addDays(2), daysLeft: 2 },
  { id: "4", subject: "Physics", chapter: "Thermodynamics", cycle: 2, score: 55, dueDate: addDays(3), daysLeft: 3 },
  { id: "5", subject: "Biology", chapter: "Cell Division", cycle: 1, score: 75, dueDate: addDays(7), daysLeft: 7 },
];

function addDays(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return d; }

const SUBJECT_COLORS: Record<string, string> = {
  Physics: "violet",
  Chemistry: "blue",
  Mathematics: "emerald",
  Biology: "pink",
  History: "orange",
  Geography: "cyan",
};

export default function SchedulerPage() {
  const [filter, setFilter] = useState<"all" | "today" | "upcoming">("all");

  const today = SAMPLE_ITEMS.filter((i) => i.daysLeft === 0);
  const upcoming = SAMPLE_ITEMS.filter((i) => i.daysLeft > 0);
  const displayed = filter === "today" ? today : filter === "upcoming" ? upcoming : SAMPLE_ITEMS;

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
          { icon: "🔴", label: "Due Today", value: today.length, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          { icon: "📅", label: "Upcoming", value: upcoming.length, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { icon: "✅", label: "Completed", value: 0, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 border ${s.bg} text-center`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
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
            {f === "all" ? "All" : f === "today" ? `Today (${today.length})` : `Upcoming (${upcoming.length})`}
          </button>
        ))}
      </div>

      {/* Revision queue */}
      {displayed.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-white/5 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-slate-400">No revisions due! Upload some notes to get started.</p>
          <Link href="/upload" className="mt-4 inline-flex btn-brand px-5 py-2.5 rounded-xl text-sm font-bold items-center gap-2">
            Upload Notes
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((item, i) => {
            const color = SUBJECT_COLORS[item.subject] || "violet";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "glass-card rounded-2xl p-5 border transition-all hover:border-white/10 group",
                  item.daysLeft === 0 ? "border-violet-500/15" : "border-white/5"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Subject badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-${color}-500/20 border border-${color}-500/20`}>
                      <span className="text-lg">
                        {item.subject === "Physics" ? "⚛️" : item.subject === "Chemistry" ? "🧪" : item.subject === "Mathematics" ? "📐" : item.subject === "Biology" ? "🌿" : "📚"}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-white font-bold text-sm">{item.chapter}</span>
                        <span className="text-slate-600 text-xs">•</span>
                        <span className="text-slate-500 text-xs">{item.subject}</span>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          item.daysLeft === 0
                            ? "bg-violet-500/15 text-violet-300 border-violet-500/25"
                            : "bg-white/5 text-slate-500 border-white/10"
                        }`}>
                          {REVISION_CYCLE_LABELS[item.cycle]} revision
                        </span>
                        <span className="text-xs text-slate-600">
                          {item.daysLeft === 0 ? "🔴 Due today" : `⏰ In ${item.daysLeft} days`}
                        </span>
                        <span className="text-xs text-slate-600">
                          Last score: <span className={item.score >= 70 ? "text-emerald-400" : "text-orange-400"}>{item.score}%</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.daysLeft === 0 && (
                    <Link
                      href={`/quiz`}
                      className="btn-brand px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Brain size={14} /> Revise
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
