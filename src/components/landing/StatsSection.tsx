"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Students in beta", icon: "👩‍🎓" },
  { value: "50K+", label: "Questions generated", icon: "🧠" },
  { value: "3×", label: "Better exam retention", icon: "📈" },
  { value: "4.9★", label: "Average rating", icon: "⭐" },
];

export default function StatsSection() {
  return (
    <section className="py-14 bg-slate-50 border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl lg:text-4xl font-black text-indigo-600 mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
