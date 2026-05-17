export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080b14]">
      {/* Logo mark */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-2xl bg-violet-500/20 animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-xl shadow-violet-500/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div className="text-2xl font-black tracking-tight mb-6">
        <span className="text-white">Stur</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">evision</span>
      </div>

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
