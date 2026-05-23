"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aryan Mehta",
    grade: "Class 12, CBSE — Delhi",
    avatar: "A",
    color: "bg-indigo-500",
    text: "I used to read the same chapter 4 times before exams and still forget it. Sturevision's scheduler made me revise at Day 1, 3, 7, and 15 — and now I actually remember everything. My Physics score went from 68 to 89.",
    score: "Physics: 68 → 89",
    scoreColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  },
  {
    name: "Priya Sharma",
    grade: "JEE Aspirant — Pune",
    avatar: "P",
    color: "bg-violet-500",
    text: "The MCQ generator is insane. I uploaded my Organic Chemistry notes and got 25 questions in 30 seconds. They were actually good questions — not random stuff. I practice these daily now.",
    score: "2 hrs saved daily",
    scoreColor: "text-violet-400 border-violet-500/20 bg-violet-500/10",
  },
  {
    name: "Rohan Gupta",
    grade: "Class 11, CBSE — Mumbai",
    avatar: "R",
    color: "bg-emerald-500",
    text: "The weak topic tracker showed me I was consistently wrong on Electrostatics. I'd never have noticed that myself. Fixed it in one focused session. My teacher was surprised by the improvement.",
    score: "Weak topics: fixed",
    scoreColor: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
  },
  {
    name: "Sneha Iyer",
    grade: "NEET Aspirant — Bengaluru",
    avatar: "S",
    color: "bg-orange-500",
    text: "The flashcard flip is so satisfying. I do 20 cards in the morning and the streak keeps me coming back. It feels like a game, not studying. Haven't missed a day in 3 weeks.",
    score: "21-day streak 🔥",
    scoreColor: "text-orange-400 border-orange-500/20 bg-orange-500/10",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 bg-[#050508] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4"
          >
            Student stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white"
          >
            Real results, real students
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 group overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none group-hover:from-white/[0.04] transition-all duration-300" />

              {/* Stars */}
              <div className="text-yellow-400 text-sm mb-4">★★★★★</div>

              {/* Quote */}
              <p className="text-slate-300 text-base leading-relaxed mb-6 relative">
                &quot;{t.text}&quot;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.grade}</p>
                  </div>
                </div>
                <div
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border ${t.scoreColor}`}
                >
                  {t.score}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
