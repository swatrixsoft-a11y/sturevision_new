"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "1",
    emoji: "📤",
    title: "Upload your notes",
    description: "Drop any PDF, photo of your notebook, or just paste text from your textbook. Any subject, any chapter.",
    color: "bg-blue-600",
    light: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    step: "2",
    emoji: "🤖",
    title: "AI builds your revision kit",
    description: "In under 30 seconds, GPT-4 creates 10–30 MCQs with explanations, flashcards, and a chapter summary.",
    color: "bg-violet-600",
    light: "bg-violet-50 border-violet-200 text-violet-700",
  },
  {
    step: "3",
    emoji: "📅",
    title: "Revise on a smart schedule",
    description: "The app tells you to revise on Day 1, 3, 7, and 15. Science-backed spacing = you remember permanently.",
    color: "bg-emerald-600",
    light: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    step: "4",
    emoji: "🎯",
    title: "Fix your weak spots",
    description: "AI tracks which topics you keep getting wrong and automatically focuses your next session on those.",
    color: "bg-orange-500",
    light: "bg-orange-50 border-orange-200 text-orange-700",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4"
          >
            Simple. Fast. Effective.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 mb-5"
          >
            How Sturevision works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-xl text-slate-500 max-w-xl mx-auto"
          >
            Most students read notes and hope they remember. Sturevision makes you actually test yourself — the only way memory works.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Arrow connectors (desktop) */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="hidden lg:flex absolute items-center justify-center"
              style={{ left: `${(i + 1) * 25 - 4}%`, top: "3.5rem", transform: "translateX(-50%)" }}>
              <ArrowRight size={18} className="text-slate-300" />
            </div>
          ))}

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300"
            >
              {/* Step number */}
              <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center text-white font-black text-lg mb-4 shadow-sm`}>
                {step.step}
              </div>

              <div className="text-4xl mb-4">{step.emoji}</div>
              <h3 className="text-slate-900 font-bold text-lg mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>

              {/* Tag */}
              <div className={`inline-flex items-center mt-4 px-3 py-1 rounded-full text-xs font-semibold border ${step.light}`}>
                Step {step.step}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center p-6 bg-indigo-50 rounded-2xl border border-indigo-100"
        >
          <p className="text-indigo-800 font-semibold">
            💡 The average Sturevision student improves their exam accuracy by <strong>23%</strong> in 2 weeks — just by following the revision schedule.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
