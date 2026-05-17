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
  },
  {
    name: "Priya Sharma",
    grade: "JEE Aspirant — Pune",
    avatar: "P",
    color: "bg-violet-500",
    text: "The MCQ generator is insane. I uploaded my Organic Chemistry notes and got 25 questions in 30 seconds. They were actually good questions — not random stuff. I practice these daily now.",
    score: "2 hrs saved daily",
  },
  {
    name: "Rohan Gupta",
    grade: "Class 11, CBSE — Mumbai",
    avatar: "R",
    color: "bg-emerald-500",
    text: "The weak topic tracker showed me I was consistently wrong on Electrostatics. I'd never have noticed that myself. Fixed it in one focused session. My teacher was surprised by the improvement.",
    score: "Weak topics: fixed",
  },
  {
    name: "Sneha Iyer",
    grade: "NEET Aspirant — Bengaluru",
    avatar: "S",
    color: "bg-orange-500",
    text: "The flashcard flip is so satisfying. I do 20 cards in the morning and the streak keeps me coming back. It feels like a game, not studying. Haven't missed a day in 3 weeks.",
    score: "21-day streak 🔥",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4"
          >
            Student stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-slate-900"
          >
            Real results, real students
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Stars */}
              <div className="text-yellow-400 text-sm mb-4">★★★★★</div>

              {/* Quote */}
              <p className="text-slate-700 text-base leading-relaxed mb-6 italic">
                &quot;{t.text}&quot;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.grade}</p>
                  </div>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
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
