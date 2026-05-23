import BrandLogo from "@/components/brand/BrandLogo";

export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080b14]">
      {/* Logo mark */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-[1.35rem] bg-violet-500/20 animate-ping" />
        <BrandLogo href="" size="xl" showWordmark={false} />
      </div>

      {/* Wordmark */}
      <BrandLogo href="" size="md" className="mb-6" />

      {/* Animated bar */}
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
            animation: "sturevision-slide 1.2s ease-in-out infinite",
          }}
        />
      </div>

      <p className="text-slate-600 text-sm mt-4 font-medium">Loading…</p>

      <style>{`
        @keyframes sturevision-slide {
          0%   { margin-left: 0%;   width: 30%; }
          50%  { margin-left: 60%;  width: 40%; }
          100% { margin-left: 0%;   width: 30%; }
        }
      `}</style>
    </div>
  );
}
