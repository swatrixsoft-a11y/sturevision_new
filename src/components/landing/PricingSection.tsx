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
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 mb-5"
          >
            Start free. Upgrade when ready.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-xl text-slate-500 mb-8"
          >
            No credit card required to start.
          </motion.p>

          {/* Monthly / Yearly toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full p-1 shadow-sm"
          >
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !yearly ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                yearly ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
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
            className="bg-white rounded-3xl border-2 border-slate-200 p-8"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Free</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-black text-slate-900">₹0</span>
              <span className="text-slate-400 text-sm mb-2">/forever</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">Perfect to try and see if it works for you.</p>

            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700 text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push("/register")}
              className="w-full py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-base hover:border-indigo-300 hover:bg-indigo-50 transition-all"
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
            className="relative bg-indigo-600 rounded-3xl border-2 border-indigo-600 p-8 shadow-2xl shadow-indigo-500/30"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg whitespace-nowrap">
              ✨ Most popular
            </div>

            <p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-3">Pro</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-black text-white">
                {yearly ? "₹999" : "₹99"}
              </span>
              <span className="text-indigo-200 text-sm mb-2">/{yearly ? "year" : "month"}</span>
            </div>
            {yearly && (
              <p className="text-emerald-300 text-sm font-semibold mb-1">
                ₹83/month — You save ₹189 🎉
              </p>
            )}
            <p className="text-indigo-200 text-sm mb-6">For serious students who want unlimited AI.</p>

            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-indigo-200 flex-shrink-0" />
                  <span className="text-white text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>

            {isPro ? (
              <div className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-base">
                <Crown size={16} />
                Pro Active — Enjoy unlimited AI!
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading || subLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-indigo-600 font-bold text-base hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Opening payment...</>
                ) : (
                  <><Zap size={16} /> Pay with UPI / Card — {yearly ? "₹999/yr" : "₹99/mo"}</>
                )}
              </button>
            )}

            {/* UPI logos */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-indigo-300 text-xs">Pay via</span>
              {["GPay", "PhonePe", "Paytm", "UPI"].map((m) => (
                <span key={m} className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                  {m}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 text-sm mt-8"
        >
          🔒 Secure payment via Razorpay &nbsp;·&nbsp; Supports GPay, PhonePe, Paytm, BHIM &nbsp;·&nbsp; Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
