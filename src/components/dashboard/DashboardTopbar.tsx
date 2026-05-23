"use client";

import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardTopbar() {
  return (
    <header className="sticky top-0 z-30 bg-[#080b14]/90 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 md:px-8 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search subjects, chapters..."
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-400 placeholder:text-slate-700 focus:outline-none focus:border-violet-500/30 transition-colors"
            suppressHydrationWarning
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5" suppressHydrationWarning>
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </button>

        {/* Streak badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <span className="text-sm">🔥</span>
          <span className="text-orange-400 font-bold text-sm">0</span>
          <span className="text-slate-600 text-xs">days</span>
        </div>

        {/* User */}
        <div className="md:hidden">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
