import { SignIn } from "@clerk/nextjs";
import BrandLogo from "@/components/brand/BrandLogo";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <BrandLogo size="md" className="mb-4 justify-center" />
          <p className="text-slate-500 text-sm">Welcome back. Your revision awaits.</p>
        </div>

        <SignIn
          fallbackRedirectUrl="/dashboard"
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
