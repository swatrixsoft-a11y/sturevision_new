"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Loader2, Crown } from "lucide-react";
import { usePayment, type PlanId } from "@/hooks/usePayment";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

const FREE_FEATURES = [
  "5 AI quiz generations per month",
  "Up to 50 flashcards",
  "Basic revision scheduler",
  "Weak topic tracking",
  "Leaderboard access",
];

const PRO_FEATURES = [
  "Unlimited AI quiz generations",
  "Unlimited flashcards",
  "Advanced spaced repetition",
  "Detailed analytics & reports",
  "Priority AI (GPT-4o)",
  "Email revision reminders",
  "Export to PDF",
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const [activePlan, setActivePlan] = useState<string>("free");
  const [subLoading, setSubLoading] = useState(true);
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { pay, loading } = usePayment({
    onSuccess: () => {
      toast.success("🎉 Payment successful! Pro is now active.");
      setActivePlan("pro");
      setTimeout(() => router.push("/dashboard"), 1500);
    },
    onError: (msg) => toast.error(msg),
  });

  useEffect(() => {
    if (!isSignedIn) { setSubLoading(false); return; }
    fetch("/api/user/subscription")
      .then((r) => r.json())
      .then((data) => {
        if (data.plan && data.status === "active") setActivePlan(data.plan);
      })
      .catch(() => {})
      .finally(() => setSubLoading(false));
  }, [isSignedIn]);

  const isPro = activePlan === "pro" || activePlan === "premium";

  function handleUpgrade() {
    if (!isSignedIn) {
      router.push("/register");
      return;
    }
    const planId: PlanId = yearly ? "pro_yearly" : "pro_monthly";
    pay(planId, user?.primaryEmailAddress?.emailAddress, user?.fullName || "");
  }

  return (
    <section id="pricing" className="py-28 bg-[#0a0a12] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#0a0a12] to-[#050508] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-5"
          >
            Start free. Upgrade when ready.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-xl text-slate-400 mb-8"
          >
            No credit card required to start.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1"
          >
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !yearly
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                yearly
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                Save 58%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-3xl border border-white/10 p-8"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Free</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-black text-white">₹0</span>
              <span className="text-slate-500 text-sm mb-2">/forever</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">Perfect to try and see if it works for you.</p>

            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push("/register")}
              className="w-full py-3.5 rounded-2xl border border-white/10 text-slate-300 font-bold text-base hover:border-indigo-500/40 hover:text-white hover:bg-white/5 transition-all"
            >
              Get started free
            </button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl border border-indigo-500/50 p-8 shadow-2xl shadow-indigo-600/25"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-amber-400 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg shadow-orange-500/30 whitespace-nowrap">
              ✨ Most popular
            </div>

            {/* Card glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

            <p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-3 relative">Pro</p>
            <div className="flex items-end gap-1 mb-2 relative">
              <span className="text-5xl font-black text-white">
                {yearly ? "₹999" : "₹99"}
              </span>
              <span className="text-indigo-200 text-sm mb-2">/{yearly ? "year" : "month"}</span>
            </div>
            {yearly && (
              <p className="text-emerald-300 text-sm font-semibold mb-1 relative">
                ₹83/month — You save ₹189 🎉
              </p>
            )}
            <p className="text-indigo-200 text-sm mb-6 relative">For serious students who want unlimited AI.</p>

            <ul className="space-y-3 mb-8 relative">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-indigo-200 flex-shrink-0" />
                  <span className="text-white text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <div className="relative">
              {isPro ? (
                <div className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-base">
                  <Crown size={16} />
                  Pro Active — Enjoy unlimited AI!
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading || subLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-indigo-700 font-bold text-base hover:bg-indigo-50 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Opening payment...
                    </>
                  ) : (
                    <>
                      <Zap size={16} /> Pay with UPI / Card — {yearly ? "₹999/yr" : "₹99/mo"}
                    </>
                  )}
                </button>
              )}

              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="text-indigo-300 text-xs">Pay via</span>
                {["GPay", "PhonePe", "Paytm", "UPI"].map((m) => (
                  <span
                    key={m}
                    className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full font-semibold"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm mt-8"
        >
          🔒 Secure payment via Razorpay &nbsp;·&nbsp; Supports GPay, PhonePe, Paytm, BHIM &nbsp;·&nbsp; Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
