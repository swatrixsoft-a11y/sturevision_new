"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Brain, Calendar, Loader2, Upload } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface DailyPoint { day: string; accuracy: number; xp: number; sessions: number; }
interface SubjectStat { subject: string; accuracy: number; sessions: number; }
interface HeatmapDay { day: number; xp: number; sessions: number; active: boolean; }
interface AnalyticsData {
  kpis: { avgAccuracy: number; totalXP: number; totalSessions: number; longestStreak: number; level: number };
  dailyStats: DailyPoint[];
  subjectStats: SubjectStat[];
  activityHeatmap: HeatmapDay[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f1629] border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-white font-bold text-sm">
          {p.name}: <span style={{ color: p.color }}>{p.value}{p.name === "accuracy" ? "%" : p.name === "XP" ? " XP" : ""}</span>
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/user/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [period]);

  const radarData = data?.subjectStats.slice(0, 6).map((s) => ({
    subject: s.subject,
    A: s.accuracy,
  })) || [];

  const hasData = (data?.kpis.totalSessions ?? 0) > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Analytics</h1>
          <p className="text-slate-500 text-sm">Track your revision progress and improvement</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                period === p
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                  : "text-slate-500 border border-white/5 hover:text-slate-300"
              )}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-violet-400 animate-spin" />
        </div>
      ) : !hasData ? (
        <div className="glass-card rounded-3xl p-16 border border-white/5 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-black text-white mb-2">No data yet</h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            Complete your first quiz to start seeing analytics and track your improvement over time.
          </p>
          <Link href="/upload" className="inline-flex items-center gap-2 btn-brand px-6 py-3 rounded-xl font-bold text-sm">
            <Upload size={16} /> Upload Notes & Generate Quiz
          </Link>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Avg Accuracy", value: `${data!.kpis.avgAccuracy}%`, icon: <Target size={18} />, color: "violet" },
              { label: "Total XP", value: data!.kpis.totalXP.toLocaleString(), icon: <Zap size={18} />, color: "blue" },
              { label: "Sessions Done", value: String(data!.kpis.totalSessions), icon: <Brain size={18} />, color: "emerald" },
              { label: "Best Streak", value: `${data!.kpis.longestStreak} days`, icon: <Calendar size={18} />, color: "orange" },
            ].map((kpi) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-5 border border-white/5"
              >
                <div className={`text-${kpi.color}-400 mb-3`}>{kpi.icon}</div>
                <div className="text-2xl font-black text-white mb-1">{kpi.value}</div>
                <div className="text-slate-500 text-xs">{kpi.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Accuracy trend */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-violet-400" />
                Accuracy Trend
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data!.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#374151" tick={{ fill: "#6b7280", fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis domain={[0, 100]} stroke="#374151" tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="accuracy"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#a78bfa" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* XP per day */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Zap size={16} className="text-blue-400" />
                XP Earned Daily
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data!.dailyStats} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#374151" tick={{ fill: "#6b7280", fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis stroke="#374151" tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="xp" name="XP" fill="url(#xpGrad)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject breakdown + Radar */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Subject accuracy bars */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-bold mb-5 flex items-center gap-2">
                <Brain size={16} className="text-emerald-400" />
                Accuracy by Subject
              </h3>
              {data!.subjectStats.length === 0 ? (
                <p className="text-slate-600 text-sm py-4 text-center">No subject data yet.</p>
              ) : (
                <div className="space-y-4">
                  {data!.subjectStats.map((s) => (
                    <div key={s.subject}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-300 font-medium">{s.subject}</span>
                        <span className={s.accuracy >= 80 ? "text-emerald-400 font-bold" : s.accuracy >= 60 ? "text-violet-400 font-bold" : "text-orange-400 font-bold"}>
                          {s.accuracy}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.accuracy}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{
                            background: s.accuracy >= 80
                              ? "linear-gradient(90deg, #10b981, #34d399)"
                              : s.accuracy >= 60
                              ? "linear-gradient(90deg, #8b5cf6, #a78bfa)"
                              : "linear-gradient(90deg, #f59e0b, #fbbf24)"
                          }}
                        />
                      </div>
                      <div className="text-slate-700 text-xs mt-1">{s.sessions} session{s.sessions !== 1 ? "s" : ""}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Radar chart */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Target size={16} className="text-orange-400" />
                Subject Performance Radar
              </h3>
              {radarData.length < 3 ? (
                <div className="flex items-center justify-center h-48">
                  <p className="text-slate-600 text-sm text-center">Study at least 3 subjects to see the radar chart.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <Radar name="Accuracy" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: "#0f1629", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* 30-day activity heatmap */}
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-pink-400" />
              30-Day Activity
            </h3>
            <div className="flex gap-1.5 flex-wrap">
              {data!.activityHeatmap.map((d) => (
                <div
                  key={d.day}
                  title={d.active ? `Day ${d.day}: ${d.xp} XP, ${d.sessions} session${d.sessions !== 1 ? "s" : ""}` : `Day ${d.day}: No activity`}
                  className={cn(
                    "w-8 h-8 rounded-lg transition-all cursor-default",
                    d.active
                      ? d.xp > 200 ? "bg-violet-500/80"
                        : d.xp > 100 ? "bg-violet-500/50"
                        : "bg-violet-500/25"
                      : "bg-white/5"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-slate-600 text-xs">Less</span>
              {["bg-white/5", "bg-violet-500/25", "bg-violet-500/50", "bg-violet-500/80"].map((c) => (
                <div key={c} className={`w-4 h-4 rounded ${c}`} />
              ))}
              <span className="text-slate-600 text-xs">More</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
