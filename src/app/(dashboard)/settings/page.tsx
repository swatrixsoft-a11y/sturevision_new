"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, CreditCard, Shield, ChevronRight, Check,
  Zap, Crown, BookOpen, Loader2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { usePayment, type PlanId } from "@/hooks/usePayment";
import toast from "react-hot-toast";
import { SUBJECTS, GRADES } from "@/types";

type SettingsTab = "profile" | "notifications" | "subscription" | "privacy";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "privacy", label: "Privacy", icon: Shield },
];

interface ProfileData {
  grade: string;
  board: string;
  subjects: string[];
  xpPoints: number;
  level: number;
  streakCount: number;
  plan: string;
  planStatus: string;
  sessionCount: number;
  flashcardCount: number;
}

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [grade, setGrade] = useState("10");
  const [board, setBoard] = useState("CBSE");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    streakAlert: true,
    weeklyReport: false,
    leaderboardUpdates: true,
    pushNotifications: true,
  });

  const { pay, loading: payLoading } = usePayment({
    onSuccess: () => {
      toast.success("Payment successful! Pro plan is now active.");
      setTimeout(() => router.refresh(), 2000);
    },
    onError: (msg) => toast.error(msg),
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d: ProfileData) => {
        setGrade(d.grade || "10");
        setBoard(d.board || "CBSE");
        setSelectedSubjects(d.subjects || []);
        setProfileData(d);
        setProfileLoading(false);
      })
      .catch(() => setProfileLoading(false));
  }, []);

  function handleUpgrade(planId: PlanId) {
    pay(planId, user?.primaryEmailAddress?.emailAddress ?? "", user?.fullName ?? "");
  }

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : prev.length < 6 ? [...prev, subject] : prev
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, board, subjects: selectedSubjects }),
      });
      if (res.ok) {
        setSaved(true);
        toast.success("Profile saved!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error("Failed to save. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isPro = profileData?.plan === "pro" || profileData?.plan === "premium";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar tabs */}
        <aside className="md:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto text-violet-400" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-5">

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <h2 className="text-white font-bold mb-5">Account Info</h2>
                <div className="flex items-center gap-5 mb-6">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user.fullName || "User"} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-violet-500/20">
                      {user?.firstName?.[0] ?? "S"}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-lg">{user?.fullName ?? "Student"}</p>
                    <p className="text-slate-500 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border",
                        isPro ? "bg-violet-500/15 text-violet-400 border-violet-500/20" : "bg-slate-500/15 text-slate-400 border-slate-500/20"
                      )}>
                        {isPro ? "Pro Plan" : "Free Plan"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        Level {profileData?.level ?? 1}
                      </span>
                    </div>
                  </div>
                </div>

                {profileLoading ? (
                  <div className="flex items-center gap-2 py-4 text-slate-500 text-sm">
                    <Loader2 size={16} className="animate-spin" /> Loading profile...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="text-slate-400 text-xs font-medium block mb-2">Grade</label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/40"
                      >
                        {GRADES.map((g) => <option key={g} value={g} className="bg-[#0f1629]">Class {g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs font-medium block mb-2">Board</label>
                      <select
                        value={board}
                        onChange={(e) => setBoard(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/40"
                      >
                        {["CBSE", "ICSE", "STATE"].map((b) => <option key={b} value={b} className="bg-[#0f1629]">{b}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-400" />
                    My Subjects
                  </h2>
                  <span className="text-slate-600 text-xs">{selectedSubjects.length}/6 selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((subject) => {
                    const selected = selectedSubjects.includes(subject);
                    return (
                      <button
                        key={subject}
                        onClick={() => toggleSubject(subject)}
                        className={cn(
                          "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all",
                          selected
                            ? "bg-violet-600/20 border-violet-500/30 text-violet-300"
                            : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-400"
                        )}
                      >
                        {selected && <Check size={10} className="inline mr-1" />}
                        {subject}
                      </button>
                    );
                  })}
                </div>
              </div>

              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                  saved ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "btn-brand",
                  saving && "opacity-70 cursor-not-allowed"
                )}
              >
                {saving ? (
                  <><Loader2 size={16} className="animate-spin" /> Saving...</>
                ) : saved ? (
                  <><Check size={16} /> Saved!</>
                ) : (
                  "Save Changes"
                )}
              </motion.button>
            </motion.div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-1">
                <h2 className="text-white font-bold mb-5">Notification Preferences</h2>
                {(Object.keys(notifications) as Array<keyof typeof notifications>).map((key) => {
                  const value = notifications[key];
                  const labels: Record<keyof typeof notifications, { label: string; desc: string }> = {
                    dailyReminder: { label: "Daily Revision Reminder", desc: "Remind me to revise every day at 6 PM" },
                    streakAlert: { label: "Streak Alerts", desc: "Notify me if I am about to break my streak" },
                    weeklyReport: { label: "Weekly Progress Report", desc: "Email summary of my weekly performance" },
                    leaderboardUpdates: { label: "Leaderboard Changes", desc: "When someone overtakes my rank" },
                    pushNotifications: { label: "Push Notifications", desc: "Allow browser push notifications" },
                  };
                  const info = labels[key];
                  return (
                    <div key={key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-none">
                      <div>
                        <p className="text-white text-sm font-medium">{info.label}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{info.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications((prev) => ({ ...prev, [key]: !value }))}
                        className={cn(
                          "relative w-11 h-6 rounded-full transition-all flex-shrink-0 ml-4",
                          value ? "bg-violet-600" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
                          value ? "left-6" : "left-1"
                        )} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SUBSCRIPTION TAB */}
          {activeTab === "subscription" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Current plan */}
              <div
                className="glass-card rounded-2xl p-6 border border-violet-500/15"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05))" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    {isPro ? <Crown size={20} className="text-yellow-400" /> : <Zap size={20} className="text-violet-400" />}
                  </div>
                  <div>
                    <p className="text-white font-bold">
                      Current Plan: {isPro ? "Pro" : "Free"}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {isPro ? "Unlimited AI generations · All features" : "5 AI generations/month · 50 flashcards"}
                    </p>
                  </div>
                </div>
                {!isPro && profileData && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Sessions", value: `${profileData.sessionCount}/∞`, color: "text-orange-400" },
                      { label: "Flashcards", value: `${Math.min(profileData.flashcardCount, 50)}/50`, color: "text-blue-400" },
                      { label: "Streak", value: `${profileData.streakCount} days`, color: "text-violet-400" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                        <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                        <div className="text-slate-600 text-xs mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!isPro && (
                <div className="space-y-3">
                  <h2 className="text-white font-bold">Upgrade Plan</h2>
                  {[
                    {
                      name: "Student Pro",
                      price: "₹99/mo",
                      yearlyPrice: "₹999/yr",
                      planId: "pro_monthly" as PlanId,
                      color: "violet",
                      popular: true,
                      icon: <Zap size={20} />,
                      features: ["Unlimited AI generations", "All subjects", "Advanced analytics", "Email reminders"],
                    },
                    {
                      name: "Premium AI",
                      price: "₹499/mo",
                      yearlyPrice: "₹2,999/yr",
                      planId: "premium_monthly" as PlanId,
                      color: "blue",
                      popular: false,
                      icon: <Crown size={20} />,
                      features: ["Everything in Pro", "Unlimited PDF uploads", "Mock test engine", "Study rooms"],
                    },
                  ].map((plan) => (
                    <div
                      key={plan.name}
                      className={cn(
                        "rounded-2xl p-5 border transition-all",
                        plan.popular ? "border-violet-500/30 bg-violet-500/5" : "border-white/5 glass-card"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            plan.color === "violet" ? "bg-violet-500/20 text-violet-400" : "bg-blue-500/20 text-blue-400"
                          )}>
                            {plan.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-bold">{plan.name}</p>
                              {plan.popular && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">Popular</span>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm">
                              {plan.price}{" "}
                              <span className="text-emerald-400">{plan.yearlyPrice} (save 58%)</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpgrade(plan.planId)}
                          disabled={payLoading}
                          className="btn-brand px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 flex items-center gap-1.5 disabled:opacity-60"
                        >
                          {payLoading && <Loader2 size={14} className="animate-spin" />}
                          Pay via UPI
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {plan.features.map((f) => (
                          <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                            <Check size={12} className="text-emerald-400 flex-shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-slate-600 text-xs">Accepted:</span>
                        {["GPay", "PhonePe", "Paytm", "BHIM", "Card"].map((m) => (
                          <span key={m} className="text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded-full border border-white/10">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isPro && (
                <div className="glass-card rounded-2xl p-8 border border-emerald-500/20 text-center">
                  <div className="text-4xl mb-3">👑</div>
                  <h3 className="text-white font-black text-xl mb-2">You&apos;re on Pro!</h3>
                  <p className="text-slate-400 text-sm">Enjoy unlimited AI generations, advanced analytics, and all premium features.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === "privacy" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
                <h2 className="text-white font-bold">Privacy and Data</h2>
                {[
                  { label: "Public leaderboard profile", desc: "Let others see your rank and XP on the leaderboard", enabled: true },
                  { label: "Share progress with friends", desc: "Allow friends to view your revision streaks", enabled: false },
                  { label: "Anonymous analytics", desc: "Help us improve Sturevision by sharing anonymous usage data", enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-none">
                    <div>
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <div className={cn("relative w-11 h-6 rounded-full ml-4 flex-shrink-0", item.enabled ? "bg-violet-600" : "bg-white/10")}>
                      <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all", item.enabled ? "left-6" : "left-1")} />
                    </div>
                  </div>
                ))}

                <div className="pt-4 space-y-3">
                  <button className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5 transition-all">
                    Download my data
                  </button>
                  <button className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/5 transition-all">
                    Delete my account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
