"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/utils/cn";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-black text-lg text-slate-900">
              Stur<span className="text-indigo-600">evision</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2">
                Sign in
              </Link>
              <Link href="/register"
                className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                Get started free →
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard"
                className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-colors">
                Go to Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          <button className="md:hidden text-slate-600 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 bg-white">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="block py-3 text-slate-600 text-sm font-medium"
                onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <SignedOut>
                <Link href="/login" className="text-sm text-slate-600 py-2">Sign in</Link>
                <Link href="/register"
                  className="text-sm font-semibold text-center bg-indigo-600 text-white py-3 rounded-xl">
                  Get started free →
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard"
                  className="text-sm font-semibold text-center bg-indigo-600 text-white py-3 rounded-xl">
                  Go to Dashboard
                </Link>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
