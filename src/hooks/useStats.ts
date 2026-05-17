"use client";

import { useState, useEffect } from "react";

interface DashboardStats {
  streakCount: number;
  xpPoints: number;
  level: number;
  totalSessions: number;
  avgAccuracy: number;
  flashcardsDue: number;
  revisionsDueToday: number;
  weakTopics: Array<{ subject: string; topic: string; accuracy: number }>;
  recentSessions: Array<{ id: string; subject: string; chapter: string; accuracy: number; completedAt: string }>;
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
