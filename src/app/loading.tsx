export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Logo mark */}
      <div className="relative mb-8">
        {/* Outer pulse ring */}
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" />
        {/* Inner icon box */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
          {/* Zap SVG inline so no import needed in server component */}
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
        <span className="text-slate-900">Stur</span>
        <span className="text-indigo-600">evision</span>
      </div>

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
