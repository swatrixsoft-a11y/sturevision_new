"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-28 bg-[#050508] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-indigo-600/90 to-violet-700/90 rounded-3xl p-12 lg:p-16 overflow-hidden border border-indigo-500/30 shadow-2xl shadow-indigo-600/20"
        >
          {/* Background circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          {/* Grid on card */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
              `,
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-indigo-200 text-sm font-semibold mb-6">
              <Sparkles size={14} />
              Free plan — no credit card needed
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              Your exam is closer<br />than you think.
            </h2>
            <p className="text-indigo-100 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Every day you study without revision is a day wasted. Start Sturevision today —
              upload your first chapter in 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-10 py-4 rounded-2xl text-base hover:bg-indigo-50 transition-all shadow-xl shadow-black/20 hover:-translate-y-0.5"
              >
                Start studying smarter — free
                <ArrowRight size={16} />
              </Link>
            </div>

            <p className="text-indigo-200/70 text-sm mt-6">
              No credit card &nbsp;·&nbsp; Free plan forever &nbsp;·&nbsp; Setup in 2 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
