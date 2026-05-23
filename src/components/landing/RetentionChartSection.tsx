"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const retentionData = [
  { day: "Day 0",  traditional: 100, sturevision: 100 },
  { day: "Day 1",  traditional: 62,  sturevision: 95 },
  { day: "Day 3",  traditional: 45,  sturevision: 91 },
  { day: "Day 7",  traditional: 32,  sturevision: 88 },
  { day: "Day 10", traditional: 24,  sturevision: 80 },
  { day: "Day 15", traditional: 18,  sturevision: 85 },
  { day: "Day 21", traditional: 12,  sturevision: 82 },
  { day: "Day 28", traditional: 8,   sturevision: 87 },
  { day: "Day 30", traditional: 7,   sturevision: 86 },
];

const revisionDays = ["Day 1", "Day 3", "Day 7", "Day 15", "Day 28"];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0c0c18] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-slate-400 text-xs mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs font-semibold" style={{ color: entry.color }}>
          {entry.name === "sturevision" ? "With Sturevision" : "Traditional study"}: {entry.value}%
        </p>
      ))}
    </div>
  );
}

export default function RetentionChartSection() {
  return (
    <section className="py-28 bg-[#050508] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4"
          >
            The science behind it
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-5"
          >
            Your memory is{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              fading right now
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Without revision, you forget 90% of what you study within a month.
            Ebbinghaus proved it in 1885. Sturevision fixes it with AI-timed spaced repetition.
          </motion.p>
        </div>

        {/* Chart card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 rounded-3xl border border-white/10 p-6 lg:p-10 mb-12"
        >
          <div className="flex flex-wrap gap-6 mb-8 justify-between items-start">
            <div>
              <h3 className="text-white font-bold text-xl mb-1">
                Memory Retention Over 30 Days
              </h3>
              <p className="text-slate-500 text-sm">Based on the Ebbinghaus Forgetting Curve</p>
            </div>
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <svg width="28" height="4">
                  <line
                    x1="0" y1="2" x2="28" y2="2"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="5,3"
                  />
                </svg>
                <span className="text-slate-400 text-xs">Traditional study</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="28" height="4">
                  <line x1="0" y1="2" x2="28" y2="2" stroke="#6366f1" strokeWidth="2.5" />
                </svg>
                <span className="text-slate-400 text-xs">With Sturevision</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={retentionData}
              margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 105]}
              />
              <Tooltip content={<CustomTooltip />} />

              {revisionDays.map((day) => (
                <ReferenceLine
                  key={day}
                  x={day}
                  stroke="rgba(99,102,241,0.25)"
                  strokeDasharray="4 3"
                  label={{
                    value: "↺",
                    position: "top",
                    fill: "#6366f1",
                    fontSize: 10,
                  }}
                />
              ))}

              <Line
                type="monotone"
                dataKey="traditional"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="sturevision"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#818cf8", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-5 flex flex-wrap gap-4 justify-center">
            {revisionDays.map((d) => (
              <div key={d} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {d} — scheduled revision
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3 callout stats */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "📉",
              stat: "90%",
              desc: "Forgotten within 1 month without any revision",
              border: "border-red-500/20",
              bg: "bg-red-500/5",
            },
            {
              icon: "🔁",
              stat: "5×",
              desc: "Better retention with spaced repetition vs passive re-reading",
              border: "border-indigo-500/20",
              bg: "bg-indigo-500/5",
            },
            {
              icon: "🧠",
              stat: "2 weeks",
              desc: "Average time before students see major improvement on Sturevision",
              border: "border-emerald-500/20",
              bg: "bg-emerald-500/5",
            },
          ].map((item, i) => (
            <motion.div
              key={item.stat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border p-6 ${item.bg} ${item.border}`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-3xl font-black text-white mb-2">{item.stat}</div>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
