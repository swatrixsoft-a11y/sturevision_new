"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { TrendingUp, Target, Zap, Clock } from "lucide-react";

const sessionData = [
  { session: "S1", score: 52 },
  { session: "S2", score: 60 },
  { session: "S3", score: 57 },
  { session: "S4", score: 68 },
  { session: "S5", score: 72 },
  { session: "S6", score: 76 },
  { session: "S7", score: 81 },
  { session: "S8", score: 87 },
];

const topicData = [
  { topic: "Mechanics", score: 82 },
  { topic: "Thermodynamics", score: 75 },
  { topic: "Optics", score: 68 },
  { topic: "Waves", score: 90 },
  { topic: "Electrostatics", score: 55 },
];

// 28 days of activity
const streakData = Array.from({ length: 28 }, (_, i) => ({
  active: i !== 3 && i !== 10 && i !== 17,
  high: i >= 18,
}));

function CustomBarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0c0c18] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-indigo-400 text-sm font-bold">{payload[0]?.value}% quiz score</p>
    </div>
  );
}

const kpis = [
  { label: "Overall Score", value: "87%", change: "+23%", Icon: TrendingUp, color: "text-emerald-400" },
  { label: "Questions Done", value: "247", change: "+18 today", Icon: Zap, color: "text-indigo-400" },
  { label: "Topics Mastered", value: "12/18", change: "67%", Icon: Target, color: "text-violet-400" },
  { label: "Study Streak", value: "21 days", change: "🔥 on fire", Icon: Clock, color: "text-orange-400" },
];

export default function AnalyticsPreviewSection() {
  const circumference = 2 * Math.PI * 40;

  return (
    <section className="py-28 bg-[#050508] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#050508] to-[#050508] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4"
          >
            Real-time analytics
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-5"
          >
            Know exactly where you stand
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-lg text-slate-400 max-w-xl mx-auto"
          >
            Every quiz, every flashcard, every session tracked. See your improvement
            in real-time and know exactly which topics need more work.
          </motion.p>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0c0c16] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Titlebar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-slate-500 text-xs">Analytics Dashboard — Physics Class 12</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">Live</span>
            </div>
          </div>

          <div className="p-5 lg:p-8 grid lg:grid-cols-3 gap-6">
            {/* LEFT + MIDDLE — Charts */}
            <div className="lg:col-span-2 space-y-5">
              {/* KPI row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {kpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-white/5 rounded-xl p-3 border border-white/5"
                  >
                    <kpi.Icon size={14} className={`${kpi.color} mb-2`} />
                    <div className={`text-lg font-black ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-slate-600 text-xs">{kpi.label}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{kpi.change}</div>
                  </div>
                ))}
              </div>

              {/* Score progress bar chart */}
              <div className="bg-white/5 rounded-2xl border border-white/5 p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-white font-bold text-sm">Score Progress</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Last 8 quiz sessions</p>
                  </div>
                  <div className="bg-emerald-500/15 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                    ↑ +35 pts overall
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={sessionData} barSize={28} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.7" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="2 4"
                      stroke="rgba(255,255,255,0.04)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="session"
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[30, 100]}
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      content={<CustomBarTooltip />}
                      cursor={{ fill: "rgba(99,102,241,0.06)" }}
                    />
                    <Bar dataKey="score" fill="url(#barGrad)" radius={[4, 4, 0, 0]}>
                      {sessionData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={i === sessionData.length - 1 ? "#818cf8" : "url(#barGrad)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Study streak heatmap */}
              <div className="bg-white/5 rounded-2xl border border-white/5 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-bold text-sm">Study Activity — Last 28 Days</h4>
                  <span className="text-orange-400 text-xs font-bold">21-day streak 🔥</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {streakData.map((day, i) => (
                    <div
                      key={i}
                      title={`Day ${i + 1}`}
                      className={`h-6 rounded-sm transition-colors ${
                        day.active && day.high
                          ? "bg-indigo-500"
                          : day.active
                          ? "bg-indigo-500/35"
                          : "bg-white/5"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  {[
                    { color: "bg-white/5", label: "No activity" },
                    { color: "bg-indigo-500/35", label: "Active" },
                    { color: "bg-indigo-500", label: "High activity" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                      <span className="text-slate-600 text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Topic breakdown + circular */}
            <div className="space-y-4">
              {/* Topic mastery */}
              <div className="bg-white/5 rounded-2xl border border-white/5 p-5">
                <h4 className="text-white font-bold text-sm mb-4">Topic Mastery</h4>
                <div className="space-y-4">
                  {topicData.map((t) => (
                    <div key={t.topic}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-slate-300 text-xs font-medium">{t.topic}</span>
                        <span
                          className={`text-xs font-bold ${
                            t.score >= 80
                              ? "text-emerald-400"
                              : t.score >= 70
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {t.score}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${t.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            t.score >= 80
                              ? "bg-emerald-500"
                              : t.score >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak topic alert */}
              <div className="bg-red-500/8 rounded-2xl border border-red-500/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                    <Target size={15} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-300 font-bold text-sm mb-1">Weak Topic Detected</p>
                    <p className="text-red-400/70 text-xs leading-relaxed">
                      Electrostatics (55%) — 2 extra sessions scheduled this week.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next revision */}
              <div className="bg-indigo-500/8 rounded-2xl border border-indigo-500/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📅</div>
                  <div>
                    <p className="text-indigo-300 font-bold text-sm mb-1">Next Revision</p>
                    <p className="text-slate-400 text-xs">Thermodynamics Ch. 2</p>
                    <p className="text-indigo-400 text-xs font-semibold mt-1">Today at 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Circular progress */}
              <div className="bg-white/5 rounded-2xl border border-white/5 p-5 text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-3">
                  <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="8"
                    />
                    <defs>
                      <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <motion.circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke="url(#circGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      whileInView={{ strokeDashoffset: circumference * 0.33 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-xl">67%</span>
                  </div>
                </div>
                <p className="text-white font-bold text-sm">Syllabus Complete</p>
                <p className="text-slate-500 text-xs mt-1">12 of 18 chapters mastered</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
