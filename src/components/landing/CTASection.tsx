"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 overflow-hidden shadow-2xl shadow-indigo-500/30"
        >
          {/* Background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative">
            <div className="text-6xl mb-6">🧠</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
              Your exam is closer<br />than you think.
            </h2>
            <p className="text-indigo-100 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Every day you study without revision is a day wasted. Start using Sturevision today — it takes 2 minutes to upload your first chapter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold px-10 py-4 rounded-2xl text-base hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Start studying smarter — free
                <ArrowRight size={16} />
              </Link>
            </div>

            <p className="text-indigo-200 text-sm mt-6">
              No credit card &nbsp;·&nbsp; Free plan forever &nbsp;·&nbsp; Setup in 2 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
