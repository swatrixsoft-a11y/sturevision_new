"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Brain,
  CreditCard,
  BarChart2,
  Calendar,
  Trophy,
  Upload,
  Settings,
  Home,
  LogOut,
  MessageSquare,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { cn } from "@/utils/cn";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload & Generate", href: "/upload", icon: Upload },
  { label: "Quiz", href: "/quiz", icon: Brain },
  { label: "Flashcards", href: "/flashcards", icon: CreditCard },
  { label: "Scheduler", href: "/scheduler", icon: Calendar },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-[#0a0d1a] border-r border-white/5 z-40">
        {/* Logo — links to landing page */}
        <div className="p-6 border-b border-white/5">
          <BrandLogo size="sm" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    "transition-colors flex-shrink-0",
                    isActive ? "text-violet-400" : "text-slate-600 group-hover:text-slate-400"
                  )}
                />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="pt-3 mt-3 border-t border-white/5">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
            >
              <Home size={18} className="text-slate-600" />
              Home page
            </Link>
          </div>
        </nav>

        {/* User section — prominent logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-default">
            {/* Clerk UserButton — click the avatar to get Sign out */}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-slate-300 text-sm font-medium truncate">My Account</p>
              <p className="text-slate-600 text-xs flex items-center gap-1">
                <LogOut size={10} />
                Click avatar to sign out
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0d1a]/95 backdrop-blur-xl border-t border-white/5 flex justify-around py-2 px-2">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all",
                isActive ? "text-violet-400" : "text-slate-600"
              )}
            >
              <item.icon size={20} />
              <span className="text-[9px] font-medium">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
        {/* Home link on mobile */}
        <Link href="/" className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-slate-600">
          <Home size={20} />
          <span className="text-[9px] font-medium">Home</span>
        </Link>
      </nav>
    </>
  );
}
