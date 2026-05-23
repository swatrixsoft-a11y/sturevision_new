import BrandLogo from "@/components/brand/BrandLogo";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Logo mark */}
      <div className="relative mb-8">
        {/* Outer pulse ring */}
        <div className="absolute inset-0 rounded-[1.35rem] bg-indigo-500/20 animate-ping" />
        {/* Inner icon box */}
        <BrandLogo href="" size="xl" showWordmark={false} />
      </div>

      {/* Wordmark */}
      <BrandLogo href="" size="md" theme="light" className="mb-6" />

      {/* Animated progress bar */}
      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
          style={{
            width: "40%",
            animation: "sturevision-slide 1.2s ease-in-out infinite",
          }}
        />
      </div>

      <p className="text-slate-400 text-sm mt-4 font-medium">Loading your revision engine…</p>

      <style>{`
        @keyframes sturevision-slide {
          0%   { margin-left: 0%;    width: 30%; }
          50%  { margin-left: 60%;   width: 40%; }
          100% { margin-left: 0%;    width: 30%; }
        }
      `}</style>
    </div>
  );
}
