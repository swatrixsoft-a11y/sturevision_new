"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const benefits = [
  "Turn any notes into MCQs in 30 seconds",
  "Never forget what you studied — ever",
  "AI schedules your revision automatically",
];

const demoSteps = [
  {
    emoji: "📄",
    title: "You upload notes",
    sub: "Physics Ch.5 — Thermodynamics.pdf",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    emoji: "🤖",
    title: "AI creates your kit",
    sub: "15 MCQs + 20 flashcards generated",
    color: "bg-violet-50 border-violet-200",
    accent: "text-violet-600",
  },
  {
    emoji: "📅",
    title: "Smart reminders",
    sub: "Revise again in 3 days — Day 1 ✅",
    color: "bg-emerald-50 border-emerald-200",
    accent: "text-emerald-600",
  },
];

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 bg-white overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6"
            >
              <Sparkles size={14} />
              Free for CBSE &amp; JEE students
            </motion.div>

            {/* Headline — plain English */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 mb-6"
            >
              Stop rereading.{" "}
              <span className="text-indigo-600">Start remembering.</span>
            </motion.h1>

            {/* Sub — one sentence */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-500 leading-relaxed mb-8 max-w-lg"
            >
              Upload your class notes → AI instantly builds MCQs &amp; flashcards → a smart schedule 
              tells you <em>exactly</em> when to revise. Your brain actually keeps the knowledge.
            </motion.p>

            {/* Benefit bullets */}
            <motion.ul
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-3 mb-10"
            >
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-slate-700 text-base font-medium">
                  <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
              >
                Try it free — no card needed
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all text-base"
              >
                See how it works
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["A", "R", "S", "P", "M"].map((l, i) => (
                  <div key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: `hsl(${230 + i * 20}, 65%, 55%)` }}>
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <span className="text-yellow-500 text-sm">★★★★★</span>
                <p className="text-slate-500 text-xs">500+ students already studying smarter</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Visual demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/80 p-8 relative">
              {/* Top bar */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4 h-6 bg-slate-100 rounded-lg" />
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {demoSteps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border ${step.color}`}
                  >
                    <span className="text-3xl">{step.emoji}</span>
                    <div>
                      <p className={`font-bold text-sm ${step.accent}`}>{step.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{step.sub}</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-6 h-6 rounded-full ${step.color} border flex items-center justify-center`}>
                        <span className="text-xs">✓</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Score bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 text-sm font-medium">Today&apos;s quiz score</span>
                  <span className="text-indigo-600 font-black text-lg">87%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "87%" }}
                    transition={{ duration: 1, delay: 1.3, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-2">+50 XP earned • 🔥 Day 7 streak</p>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30"
            >
              🎯 Score improved by 23%
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white border border-slate-200 shadow-xl rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700"
            >
              🔥 Revision due in <span className="text-indigo-600">2 hrs</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
