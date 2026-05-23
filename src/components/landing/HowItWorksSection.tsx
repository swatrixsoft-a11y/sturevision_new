"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    emoji: "📤",
    title: "Upload your notes",
    description:
      "Drop any PDF, photo of your notebook, or paste text. Any subject, any chapter — CBSE, JEE, NEET.",
    color: "bg-blue-600",
    glow: "shadow-blue-600/20",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    tag: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  },
  {
    step: "02",
    emoji: "🤖",
    title: "AI builds your revision kit",
    description:
      "In under 30 seconds, AI creates 10–30 MCQs with explanations, smart flashcards, and a chapter summary.",
    color: "bg-violet-600",
    glow: "shadow-violet-600/20",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
    tag: "text-violet-400 border-violet-500/20 bg-violet-500/10",
  },
  {
    step: "03",
    emoji: "📅",
    title: "Revise on a smart schedule",
    description:
      "The app reminds you to revise on Day 1, 3, 7, and 15. Science-backed spacing = you remember permanently.",
    color: "bg-emerald-600",
    glow: "shadow-emerald-600/20",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    tag: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  },
  {
    step: "04",
    emoji: "🎯",
    title: "Fix your weak spots",
    description:
      "AI tracks which topics you keep getting wrong and automatically focuses your next session on those.",
    color: "bg-orange-500",
    glow: "shadow-orange-500/20",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
    tag: "text-orange-400 border-orange-500/20 bg-orange-500/10",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 bg-[#0a0a12] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#0a0a12] to-[#050508] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4"
          >
            Simple. Fast. Effective.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-5"
          >
            How Sturevision works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-lg text-slate-400 max-w-xl mx-auto"
          >
            Most students read notes and hope they remember. Sturevision makes you
            actually test yourself — the only way memory works.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {/* Desktop connectors */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="hidden lg:flex absolute items-center"
              style={{ left: `${(i + 1) * 25 - 3}%`, top: "3rem" }}
            >
              <ArrowRight size={16} className="text-white/15" />
            </div>
          ))}

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 hover:border-white/20 transition-all duration-300 ${step.bg} ${step.border}`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center text-white font-black text-sm mb-4 shadow-lg ${step.glow}`}
              >
                {step.step}
              </div>
              <div className="text-4xl mb-4">{step.emoji}</div>
              <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              <div className={`inline-flex items-center mt-4 px-3 py-1 rounded-full text-xs font-semibold border ${step.tag}`}>
                Step {step.step}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom highlight */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"
        >
          <p className="text-indigo-300 font-semibold">
            💡 The average Sturevision student improves their exam accuracy by{" "}
            <strong className="text-white">23%</strong> in 2 weeks — just by following the schedule.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
