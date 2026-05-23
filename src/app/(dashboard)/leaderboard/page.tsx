"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, Flame, Crown, Loader2, Wifi } from "lucide-react";
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
  isCurrentUser?: boolean;
}

const AVATAR_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#ef4444", "#06b6d4", "#a855f7"];
const PODIUM_LABELS = ["🥇", "🥈", "🥉"];

function Avatar({ entry, size = "md" }: { entry: LeaderEntry; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-[72px] h-[72px] text-2xl" : size === "md" ? "w-10 h-10 text-base" : "w-14 h-14 text-xl";
  const idx = entry.rank ? (entry.rank - 1) % AVATAR_COLORS.length : 0;
  const bg = `linear-gradient(135deg, ${AVATAR_COLORS[idx]}, ${AVATAR_COLORS[(idx + 1) % AVATAR_COLORS.length]}88)`;
  const initial = (entry.name || "?")[0].toUpperCase();

  if (entry.avatar && entry.avatar.startsWith("http")) {
    return (
      <img
        src={entry.avatar}
        alt={entry.name}
        className={`${sz} rounded-2xl object-cover flex-shrink-0`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <div className={`${sz} rounded-2xl flex items-center justify-center font-black text-white flex-shrink-0 shadow-lg`} style={{ background: bg }}>
      {initial}
    </div>
  );
}

type Filter = "global" | "weekly";

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<Filter>("global");
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [myPosition, setMyPosition] = useState<LeaderEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { onlineCount } = useLeaderboard();
  const [liveMsg, setLiveMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/user/leaderboard?period=${filter}`)
      .then((r) => r.json())
      .then((d) => {
        setLeaders(d.leaders || []);
        setMyPosition(d.myPosition || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  // Cycle live update messages using real top leaders
  useEffect(() => {
    if (leaders.length === 0) return;
    const top = leaders.slice(0, 4);
    let i = 0;
    const msgs = top.map((l) => `⚡ ${l.name.split(" ")[0]} just earned XP!`);
    const interval = setInterval(() => {
      setLiveMsg(msgs[i % msgs.length]);
      i++;
    }, 5000);
    return () => clearInterval(interval);
  }, [leaders]);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const myEntry = leaders.find((l) => l.isCurrentUser) || myPosition;

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
          <span className="text-emerald-400 text-xs font-bold">{onlineCount || 1} online</span>
        </div>
      </div>

      {/* Live update ticker */}
      <AnimatePresence mode="wait">
        {liveMsg && (
          <motion.div
            key={liveMsg}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20"
          >
            <Wifi size={14} className="text-violet-400 flex-shrink-0" />
            <span className="text-violet-300 text-sm">{liveMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
        {(["global", "weekly"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all",
              filter === f ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {f === "global" ? "🌍 Global" : "📅 This Week"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-violet-400 animate-spin" />
        </div>
      ) : leaders.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 border border-white/5 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-black text-white mb-2">Be the first on the board!</h2>
          <p className="text-slate-400 mb-2">Complete quizzes to earn XP and appear on the leaderboard.</p>
        </div>
      ) : (
        <>
          {/* Podium — Top 3 */}
          {top3.length >= 2 && (
            <div className="flex items-end justify-center gap-4 pt-4 pb-2">
              {/* 2nd place */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar entry={top3[1]} size="sm" />
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
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center gap-2">
                <Crown size={24} className="text-yellow-400 mb-1" style={{ filter: "drop-shadow(0 0 8px #f59e0b)" }} />
                <div className="relative">
                  <Avatar entry={top3[0]} size="lg" />
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
              {top3[2] && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Avatar entry={top3[2]} size="sm" />
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
              )}
            </div>
          )}

          {/* Full list */}
          <div className="space-y-2">
            {leaders.map((entry, i) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
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

                <Avatar entry={entry} size="md" />

                {/* Name + level */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-bold text-sm", entry.isCurrentUser ? "text-violet-300" : "text-white")}>
                      {entry.name}
                      {entry.isCurrentUser && <span className="text-xs text-slate-500 ml-1">(you)</span>}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-500">Lv.{entry.level}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Flame size={11} className="text-orange-400" />
                    <span className="text-xs text-slate-600">{entry.streakCount} day streak</span>
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

          {/* My rank sticky footer (if not in top list) */}
          {myEntry && !leaders.find((l) => l.isCurrentUser) && (
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
        </>
      )}
    </div>
  );
}
