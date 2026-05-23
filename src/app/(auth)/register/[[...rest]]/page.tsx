"use client";

import dynamic from "next/dynamic";
import { Zap } from "lucide-react";
import Link from "next/link";

const SignUp = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignUp),
  { ssr: false }
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl">
              <span className="text-white">Stur</span>
              <span className="gradient-text">evision</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm">Join 500+ students who study smarter.</p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-[#0f1629] border border-white/10 shadow-2xl rounded-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-400",
              formButtonPrimary: "btn-brand",
              formFieldInput: "bg-white/5 border-white/10 text-white placeholder:text-slate-600",
              formFieldLabel: "text-slate-400",
              footerAction: "text-slate-400",
              footerActionLink: "text-violet-400",
              dividerLine: "bg-white/10",
              dividerText: "text-slate-600",
              socialButtonsBlockButton: "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10",
              socialButtonsBlockButtonText: "text-slate-300",
            },
          }}
        />
      </div>
    </div>
  );
}
