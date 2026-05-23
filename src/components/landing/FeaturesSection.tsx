"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🧠",
    title: "AI MCQ Generator",
    description:
      "Upload any PDF or paste text — get 10–30 MCQs with full explanations in seconds. Each question is calibrated to your difficulty level.",
    badge: "Most used",
    accent: "indigo",
    glow: "group-hover:shadow-indigo-500/20",
    border: "group-hover:border-indigo-500/40",
    badgeBg: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20",
  },
  {
    icon: "🃏",
    title: "Smart Flashcards",
    description:
      "Flashcards that know when you're forgetting. The SM-2 algorithm shows each card at the exact right moment — not too soon, not too late.",
    badge: "Memory science",
    accent: "violet",
    glow: "group-hover:shadow-violet-500/20",
    border: "group-hover:border-violet-500/40",
    badgeBg: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  },
  {
    icon: "📅",
    title: "Revision Scheduler",
    description:
      "Study today. Revise on Day 1, 3, 7, and 15. Your AI scheduler sends reminders at each step so nothing slips through the cracks.",
    badge: "Your secret weapon",
    accent: "emerald",
    glow: "group-hover:shadow-emerald-500/20",
    border: "group-hover:border-emerald-500/40",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  },
  {
    icon: "📊",
    title: "Weak Topic Tracker",
    description:
      "After every quiz, AI marks exactly which topics you struggled with. Your next session focuses only on those — no more wasted time.",
    badge: "Personalised AI",
    accent: "orange",
    glow: "group-hover:shadow-orange-500/20",
    border: "group-hover:border-orange-500/40",
    badgeBg: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  },
  {
    icon: "🔥",
    title: "Daily Streaks & XP",
    description:
      "Earn XP, level up, and maintain your study streak. Badges unlock for achievements. Revision stops feeling like a chore.",
    badge: "Gamification",
    accent: "red",
    glow: "group-hover:shadow-red-500/20",
    border: "group-hover:border-red-500/40",
    badgeBg: "bg-red-500/15 text-red-400 border border-red-500/20",
  },
  {
    icon: "🏆",
    title: "Live Leaderboard",
    description:
      "See where you rank against classmates in real-time. Healthy competition keeps you consistent. Updated live, every session.",
    badge: "Real-time",
    accent: "yellow",
    glow: "group-hover:shadow-yellow-500/20",
    border: "group-hover:border-yellow-500/40",
    badgeBg: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-[#0a0a12] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#0a0a12] to-[#050508] pointer-events-none" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4"
          >
            Everything you need
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-5"
          >
            One app. Total revision.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Other apps just give you notes or videos. Sturevision makes you practice,
            tests your memory, and schedules everything automatically.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative bg-white/5 rounded-2xl border border-white/10 ${f.border} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${f.glow} cursor-default overflow-hidden`}
            >
              {/* Hover glow overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${f.badgeBg}`}>
                {f.badge}
              </span>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
