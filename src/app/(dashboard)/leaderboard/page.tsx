"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, Flame, Crown, Users, Wifi } from "lucide-react";
import { useLeaderboard } from "@/hooks/useSocket";
import { cn } from "@/utils/cn";

interface LeaderEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xpPoints: number;
  streakCount: number;
  level: number;
  subject?: string;
  isCurrentUser?: boolean;
}

const SAMPLE_LEADERS: LeaderEntry[] = [
  { rank: 1, userId: "u1", name: "Arjun Sharma", avatar: "A", xpPoints: 12450, streakCount: 34, level: 26, isCurrentUser: false },
  { rank: 2, userId: "u2", name: "Priya Nair", avatar: "P", xpPoints: 11200, streakCount: 28, level: 23, isCurrentUser: false },
  { rank: 3, userId: "u3", name: "Rohan Gupta", avatar: "R", xpPoints: 9800, streakCount: 47, level: 20, isCurrentUser: false },
  { rank: 4, userId: "u4", name: "Sneha Patel", avatar: "S", xpPoints: 8650, streakCount: 15, level: 18, isCurrentUser: false },
  { rank: 5, userId: "u5", name: "Kabir Mehta", avatar: "K", xpPoints: 7900, streakCount: 22, level: 16, isCurrentUser: false },
  { rank: 6, userId: "u6", name: "Ananya Singh", avatar: "A", xpPoints: 6700, streakCount: 9, level: 14, isCurrentUser: false },
  { rank: 7, userId: "u7", name: "Vikram Rao", avatar: "V", xpPoints: 5500, streakCount: 12, level: 12, isCurrentUser: false },
  { rank: 8, userId: "u8", name: "Meera Iyer", avatar: "M", xpPoints: 4200, streakCount: 6, level: 9, isCurrentUser: false },
  { rank: 9, userId: "you", name: "You", avatar: "Y", xpPoints: 1350, streakCount: 3, level: 3, isCurrentUser: true },
];

const MEDAL_COLORS = ["#f59e0b", "#94a3b8", "#c97c2b"];
const PODIUM_LABELS = ["🥇", "🥈", "🥉"];
const AVATAR_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#ef4444", "#06b6d4", "#a855f7"];

type Filter = "global" | "weekly" | "subject";

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<Filter>("global");
  const [leaders, setLeaders] = useState<LeaderEntry[]>(SAMPLE_LEADERS);
  const { onlineCount } = useLeaderboard();
  const [liveUpdates, setLiveUpdates] = useState<string[]>([]);

  // Simulate live updates
  useEffect(() => {
    const msgs = [
      "🔥 Arjun just earned 50 XP!",
      "⚡ Priya completed a 30-day streak!",
      "🏆 Rohan moved up to rank #3!",
      "🧠 Sneha aced a Physics quiz!",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLiveUpdates([msgs[i % msgs.length]]);
      i++;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const myEntry = leaders.find((l) => l.isCurrentUser);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Leaderboard</h1>
          <p className="text-slate-500 text-sm">Compete with students nationwide</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-bold">{onlineCount || 42} online</span>
        </div>
      </div>

      {/* Live update ticker */}
      <AnimatePresence mode="wait">
        {liveUpdates[0] && (
          <motion.div
            key={liveUpdates[0]}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20"
          >
            <Wifi size={14} className="text-violet-400 flex-shrink-0" />
            <span className="text-violet-300 text-sm">{liveUpdates[0]}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
        {(["global", "weekly", "subject"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all",
              filter === f ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {f === "global" ? "🌍 Global" : f === "weekly" ? "📅 This Week" : "📚 Subject"}
          </button>
        ))}
      </div>

      {/* Podium — Top 3 */}
      <div className="flex items-end justify-center gap-4 pt-4 pb-2">
        {/* 2nd place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${AVATAR_COLORS[1]}, ${AVATAR_COLORS[1]}88)` }}>
              {top3[1]?.avatar}
            </div>
            <span className="absolute -top-2 -right-2 text-lg">🥈</span>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xs">{top3[1]?.name.split(" ")[0]}</p>
            <p className="text-slate-500 text-xs">{top3[1]?.xpPoints.toLocaleString()} XP</p>
          </div>
          <div className="w-24 h-20 rounded-t-xl flex items-center justify-center font-black text-2xl"
            style={{ background: "linear-gradient(135deg, rgba(148,163,184,0.2), rgba(148,163,184,0.1))", border: "1px solid rgba(148,163,184,0.2)" }}>
            2
          </div>
        </motion.div>

        {/* 1st place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-2"
        >
          <Crown size={24} className="text-yellow-400 mb-1" style={{ filter: "drop-shadow(0 0 8px #f59e0b)" }} />
          <div className="relative">
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${AVATAR_COLORS[0]}, ${AVATAR_COLORS[0]}88)`, boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}>
              {top3[0]?.avatar}
            </div>
            <span className="absolute -top-3 -right-2 text-2xl">🥇</span>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-sm">{top3[0]?.name.split(" ")[0]}</p>
            <p className="text-violet-400 text-xs font-bold">{top3[0]?.xpPoints.toLocaleString()} XP</p>
          </div>
          <div className="w-24 h-28 rounded-t-xl flex items-center justify-center font-black text-2xl"
            style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))", border: "1px solid rgba(245,158,11,0.3)" }}>
            1
          </div>
        </motion.div>

        {/* 3rd place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${AVATAR_COLORS[2]}, ${AVATAR_COLORS[2]}88)` }}>
              {top3[2]?.avatar}
            </div>
            <span className="absolute -top-2 -right-2 text-lg">🥉</span>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xs">{top3[2]?.name.split(" ")[0]}</p>
            <p className="text-slate-500 text-xs">{top3[2]?.xpPoints.toLocaleString()} XP</p>
          </div>
          <div className="w-24 h-14 rounded-t-xl flex items-center justify-center font-black text-2xl"
            style={{ background: "linear-gradient(135deg, rgba(201,124,43,0.2), rgba(201,124,43,0.1))", border: "1px solid rgba(201,124,43,0.2)" }}>
            3
          </div>
        </motion.div>
      </div>

      {/* Full leaderboard list */}
      <div className="space-y-2">
        {leaders.map((entry, i) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border transition-all",
              entry.isCurrentUser
                ? "bg-violet-500/10 border-violet-500/25"
                : "glass-card border-white/5 hover:border-white/10"
            )}
          >
            {/* Rank */}
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0",
              entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
              entry.rank === 2 ? "bg-slate-400/20 text-slate-300" :
              entry.rank === 3 ? "bg-orange-600/20 text-orange-400" :
              "bg-white/5 text-slate-500"
            )}>
              {entry.rank <= 3 ? PODIUM_LABELS[entry.rank - 1] : `#${entry.rank}`}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${AVATAR_COLORS[i % AVATAR_COLORS.length]}, ${AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length]}88)` }}>
              {entry.avatar}
            </div>

            {/* Name + level */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("font-bold text-sm", entry.isCurrentUser ? "text-violet-300" : "text-white")}>
                  {entry.name} {entry.isCurrentUser && <span className="text-xs text-slate-500">(you)</span>}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-500">Lv.{entry.level}</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <Flame size={11} className="text-orange-400" />
                  {entry.streakCount} day streak
                </span>
              </div>
            </div>

            {/* XP */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 justify-end">
                <Zap size={14} className="text-violet-400" />
                <span className="text-white font-black text-sm">{entry.xpPoints.toLocaleString()}</span>
              </div>
              <span className="text-slate-600 text-xs">XP</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* My rank sticky footer (if not in top 10) */}
      {myEntry && myEntry.rank > 10 && (
        <div className="sticky bottom-20 md:bottom-6">
          <div className="glass-card rounded-2xl p-4 border border-violet-500/25 flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-black text-sm flex-shrink-0">
              #{myEntry.rank}
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Your Rank</p>
              <p className="text-slate-500 text-xs">{myEntry.xpPoints} XP · Keep studying to climb up!</p>
            </div>
            <Zap size={18} className="text-violet-400" />
          </div>
        </div>
      )}
    </div>
  );
}
