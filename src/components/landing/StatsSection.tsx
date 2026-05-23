"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({
  end,
  suffix,
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  {
    end: 500,
    suffix: "+",
    label: "Students in beta",
    sub: "Growing every week",
    accent: "text-indigo-400",
    border: "border-indigo-500/15",
    bg: "bg-indigo-500/5",
  },
  {
    end: 50,
    suffix: "K+",
    label: "Questions generated",
    sub: "Across all subjects",
    accent: "text-violet-400",
    border: "border-violet-500/15",
    bg: "bg-violet-500/5",
  },
  {
    end: 23,
    suffix: "%",
    label: "Avg score improvement",
    sub: "In first 2 weeks",
    accent: "text-emerald-400",
    border: "border-emerald-500/15",
    bg: "bg-emerald-500/5",
  },
  {
    end: 98,
    suffix: "%",
    label: "Retention with SR",
    sub: "vs 7% without revision",
    accent: "text-cyan-400",
    border: "border-cyan-500/15",
    bg: "bg-cyan-500/5",
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-[#050508]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-2xl border p-6 ${s.bg} ${s.border}`}
            >
              <div className={`text-4xl font-black ${s.accent} mb-1`}>
                <Counter end={s.end} suffix={s.suffix} />
              </div>
              <div className="text-white font-semibold text-sm mb-1">{s.label}</div>
              <div className="text-slate-600 text-xs">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
