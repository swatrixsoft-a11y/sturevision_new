"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🧠",
    title: "AI MCQ Generator",
    description: "Upload any PDF or paste text — get 10–30 MCQs with explanations in seconds. Each question is calibrated to your difficulty level.",
    badge: "Most used",
    badgeColor: "bg-indigo-100 text-indigo-700",
    border: "border-indigo-100 hover:border-indigo-300",
  },
  {
    icon: "🃏",
    title: "Smart Flashcards",
    description: "Flashcards that know when you're forgetting. The SM-2 algorithm shows you each card at the exact right moment — not too soon, not too late.",
    badge: "Memory science",
    badgeColor: "bg-violet-100 text-violet-700",
    border: "border-violet-100 hover:border-violet-300",
  },
  {
    icon: "📅",
    title: "Revision Scheduler",
    description: "Study today. Revise tomorrow. Then Day 3, 7, and 15. Your personal AI scheduler sends reminders at each step so nothing slips through.",
    badge: "Your secret weapon",
    badgeColor: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-100 hover:border-emerald-300",
  },
  {
    icon: "📊",
    title: "Weak Topic Tracker",
    description: "After every quiz, AI marks exactly which topics you struggled with. Your next session focuses only on those. No more wasted revision time.",
    badge: "Personalised AI",
    badgeColor: "bg-orange-100 text-orange-700",
    border: "border-orange-100 hover:border-orange-300",
  },
  {
    icon: "🔥",
    title: "Daily Streaks & XP",
    description: "Earn XP, level up, and maintain your study streak. Badges unlock for achievements. Revision stops feeling like a chore and starts feeling like a game.",
    badge: "Gamification",
    badgeColor: "bg-red-100 text-red-700",
    border: "border-red-100 hover:border-red-300",
  },
  {
    icon: "🏆",
    title: "Live Leaderboard",
    description: "See where you rank against classmates in real-time. Healthy competition keeps you consistent. Updated live, every study session.",
    badge: "Real-time",
    badgeColor: "bg-yellow-100 text-yellow-700",
    border: "border-yellow-100 hover:border-yellow-300",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4"
          >
            Everything you need
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 mb-5"
          >
            One app. Total revision.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto"
          >
            Other apps just give you notes or videos. Sturevision makes you practice, tests your memory, and schedules everything. It&apos;s the difference between reading about swimming and actually swimming.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`bg-white rounded-2xl border-2 ${f.border} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${f.badgeColor}`}>
                {f.badge}
              </span>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-slate-900 font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
