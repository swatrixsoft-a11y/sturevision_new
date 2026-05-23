"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const weekScores = [
  { day: "M", score: 55 },
  { day: "T", score: 62 },
  { day: "W", score: 58 },
  { day: "T2", score: 70 },
  { day: "F", score: 75 },
  { day: "S", score: 80 },
  { day: "S2", score: 87 },
];

const barColors = [
  "#4f46e5",
  "#5651e5",
  "#5451d6",
  "#5b52e8",
  "#6060ea",
  "#6b62ed",
  "#818cf8",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-[#050508] overflow-hidden">
      {/* Grid + radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.20) 0%, transparent 70%),
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
          `,
          backgroundSize: "auto, 72px 72px, 72px 72px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-8"
            >
              <Sparkles size={14} />
              AI-powered revision for CBSE &amp; JEE
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-white">Stop rereading.</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Start remembering.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg"
            >
              Upload your notes → AI generates MCQs &amp; flashcards in 30 seconds →
              a smart schedule tells you exactly when to revise. Your brain actually keeps it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 mb-10"
            >
              {[
                "MCQs & flashcards from any PDF in 30 seconds",
                "Science-backed spaced repetition schedule",
                "AI tracks your weak topics automatically",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                  <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Start free — no card needed
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-slate-300 font-semibold hover:border-white/20 hover:text-white hover:bg-white/5 transition-all text-base"
              >
                See how it works
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["A", "R", "S", "P", "M"].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#050508] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: `hsl(${225 + i * 28}, 65%, 62%)` }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-yellow-400 text-xs">★★★★★</div>
                <p className="text-slate-500 text-xs">500+ students studying smarter</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Dark app mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-[#0c0c16] rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6">
              {/* Gradient sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.07] via-transparent to-violet-500/[0.05] pointer-events-none rounded-3xl" />

              {/* Browser bar */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <div className="flex-1 mx-3 h-6 bg-white/5 rounded-md border border-white/5 flex items-center px-3">
                  <span className="text-slate-600 text-xs">sturevision.app/dashboard</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Questions", value: "247", color: "text-indigo-400", bg: "bg-indigo-500/10" },
                  { label: "Accuracy", value: "87%", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { label: "Streak", value: "21🔥", color: "text-orange-400", bg: "bg-orange-500/10" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-white/5`}>
                    <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white text-xs font-semibold">Quiz scores this week</span>
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <TrendingUp size={10} /> +23%
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={64}>
                  <BarChart data={weekScores} barSize={22} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                      {weekScores.map((_, i) => (
                        <Cell key={i} fill={barColors[i]} />
                      ))}
                    </Bar>
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a2e",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#94a3b8" }}
                      itemStyle={{ color: "#a5b4fc" }}
                      formatter={(v) => [`${v}%`, "Score"]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-around mt-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className="flex-1 text-center text-slate-600 text-[10px]">{d}</span>
                  ))}
                </div>
              </div>

              {/* Active quiz */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-xs font-semibold">📚 Physics — Thermodynamics</span>
                  <span className="text-indigo-400 text-xs">Q5 of 15</span>
                </div>
                <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                  What is the efficiency of a Carnot engine at 127°C and 27°C?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["20%", "25%", "33%", "50%"].map((opt, i) => (
                    <div
                      key={i}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center border ${
                        i === 1
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : "border-white/5 text-slate-600"
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge top */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-600/30 border border-white/10"
            >
              🎯 Score up 23% this week
            </motion.div>

            {/* Floating badge bottom */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-6 bg-[#0c0c16] border border-white/10 shadow-2xl rounded-2xl px-4 py-3 text-sm font-semibold text-white"
            >
              🔥 Revision due in <span className="text-indigo-400">2 hours</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
