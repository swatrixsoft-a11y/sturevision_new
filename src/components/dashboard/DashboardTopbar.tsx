"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Search, X, Loader2, CreditCard, Calendar, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/utils/cn";

// ── Types ──────────────────────────────────────────────────────────────────

interface NotifData {
  flashcardsDue: number;
  revisionsDue: Array<{ id: string; subject: string; chapter: string }>;
  streak: number;
}

interface SearchResults {
  flashcards: Array<{ _id: string; front: string; subject: string; difficulty: string }>;
  sessions: Array<{ _id: string; subject: string; chapter: string; accuracy: number }>;
}

// ── Notification dropdown ──────────────────────────────────────────────────

function NotificationDropdown({
  data,
  loading,
  streak,
  onClose,
}: {
  data: NotifData | null;
  loading: boolean;
  streak: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const total = (data?.flashcardsDue ?? 0) + (data?.revisionsDue?.length ?? 0);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-[#0f1629] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="text-sm font-semibold text-slate-300">Notifications</span>
        <button onClick={onClose} className="text-slate-600 hover:text-slate-400">
          <X size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {/* Streak */}
          <div className="px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-sm font-semibold text-white">
                {streak > 0 ? `${streak}-day streak!` : "Start your streak today"}
              </p>
              <p className="text-xs text-slate-500">
                {streak > 0
                  ? "Keep it up — study every day to maintain your streak"
                  : "Complete a quiz or review flashcards to begin"}
              </p>
            </div>
          </div>

          {/* Flashcards due */}
          {(data?.flashcardsDue ?? 0) > 0 && (
            <Link
              href="/flashcards"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <CreditCard size={14} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {data!.flashcardsDue} flashcard{data!.flashcardsDue !== 1 ? "s" : ""} due
                </p>
                <p className="text-xs text-slate-500">Tap to start review session</p>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400" />
            </Link>
          )}

          {/* Revisions due */}
          {(data?.revisionsDue?.length ?? 0) > 0 && (
            <div>
              <div className="px-4 py-2">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Due for revision today
                </p>
              </div>
              {data!.revisionsDue.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href="/scheduler"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.chapter}</p>
                    <p className="text-xs text-slate-500">{item.subject}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400" />
                </Link>
              ))}
            </div>
          )}

          {total === 0 && !loading && (
            <div className="px-4 py-6 text-center">
              <p className="text-slate-500 text-sm">All caught up for today!</p>
              <p className="text-slate-600 text-xs mt-1">Come back tomorrow for new revisions.</p>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 bg-white/2">
            <Link
              href="/scheduler"
              onClick={onClose}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View full revision schedule <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Search overlay ─────────────────────────────────────────────────────────

function SearchOverlay({
  query,
  onChange,
  results,
  loading,
  onClose,
}: {
  query: string;
  onChange: (v: string) => void;
  results: SearchResults | null;
  loading: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasResults =
    results && (results.flashcards.length > 0 || results.sessions.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0f1629] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
          <Search size={16} className="text-slate-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search flashcards, subjects, chapters…"
            className="flex-1 bg-transparent text-white placeholder:text-slate-600 outline-none text-sm"
          />
          {loading && <Loader2 size={14} className="animate-spin text-slate-500 flex-shrink-0" />}
          <button onClick={onClose} className="text-slate-600 hover:text-slate-400 flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {!query && (
            <div className="p-4 space-y-1">
              <p className="text-xs text-slate-600 uppercase tracking-wide font-medium mb-3">
                Quick links
              </p>
              {[
                { href: "/upload", icon: "⬆️", label: "Upload Notes", desc: "Add new study material" },
                { href: "/flashcards", icon: "🃏", label: "Study Flashcards", desc: "Review due cards" },
                { href: "/quiz", icon: "🧠", label: "Take a Quiz", desc: "Test your knowledge" },
                { href: "/scheduler", icon: "📅", label: "Revision Schedule", desc: "See what's due today" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="text-lg">{link.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-300">{link.label}</p>
                    <p className="text-xs text-slate-600">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query && !loading && !hasResults && (
            <div className="py-10 text-center">
              <p className="text-slate-500 text-sm">No results for &quot;{query}&quot;</p>
            </div>
          )}

          {hasResults && (
            <div className="p-2">
              {/* Flashcard results */}
              {results!.flashcards.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-slate-600 uppercase tracking-wide font-medium px-2 py-1.5">
                    Flashcards
                  </p>
                  {results!.flashcards.map((card) => (
                    <Link
                      key={card._id}
                      href="/flashcards"
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                        <CreditCard size={14} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{card.front}</p>
                        <p className="text-xs text-slate-500">{card.subject}</p>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0",
                          card.difficulty === "easy"
                            ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                            : card.difficulty === "hard"
                            ? "text-red-400 border-red-500/20 bg-red-500/10"
                            : "text-violet-400 border-violet-500/20 bg-violet-500/10"
                        )}
                      >
                        {card.difficulty}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Session results */}
              {results!.sessions.length > 0 && (
                <div>
                  <p className="text-xs text-slate-600 uppercase tracking-wide font-medium px-2 py-1.5">
                    Revision Sessions
                  </p>
                  {results!.sessions.map((session) => (
                    <Link
                      key={session._id}
                      href="/scheduler"
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                        <Brain size={14} className="text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{session.chapter}</p>
                        <p className="text-xs text-slate-500">{session.subject}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-400 flex-shrink-0">
                        {session.accuracy}%
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-white/5 flex items-center gap-4 text-[10px] text-slate-700">
          <span>↵ to navigate</span>
          <span>Esc to close</span>
          <span>⌘K to reopen</span>
        </div>
      </div>
    </div>
  );
}

// ── Main topbar ────────────────────────────────────────────────────────────

export default function DashboardTopbar({ streak = 0 }: { streak?: number }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifData, setNotifData] = useState<NotifData | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Fetch notifications once when first opened
  const fetchNotifications = useCallback(async () => {
    if (notifData) return;
    setNotifLoading(true);
    try {
      const [flashResp, schedResp] = await Promise.all([
        fetch("/api/flashcards?due=true").then((r) => r.json()),
        fetch("/api/schedule?filter=today").then((r) => r.json()),
      ]);
      setNotifData({
        flashcardsDue: flashResp.total ?? flashResp.cards?.length ?? 0,
        revisionsDue: (schedResp.items || []).slice(0, 5).map((i: any) => ({
          id: String(i.id),
          subject: i.subject,
          chapter: i.chapter,
        })),
        streak,
      });
    } catch {
      setNotifData({ flashcardsDue: 0, revisionsDue: [], streak });
    } finally {
      setNotifLoading(false);
    }
  }, [notifData, streak]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data);
      } catch {
        setSearchResults(null);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, [searchQuery]);

  // Keyboard shortcut: ⌘K or / to open search, Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement))
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults(null);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#080b14]/90 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 md:px-8 gap-4">
        {/* Search trigger button */}
        <div className="flex-1 max-w-sm">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full relative flex items-center gap-2 bg-white/5 border border-white/5 hover:border-violet-500/20 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-600 transition-colors text-left"
            suppressHydrationWarning
          >
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            Search subjects, chapters…
            <span className="ml-auto hidden sm:inline text-xs bg-white/5 px-1.5 py-0.5 rounded text-slate-700">
              ⌘K
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Notification bell */}
          <div className="relative" suppressHydrationWarning>
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                fetchNotifications();
              }}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              suppressHydrationWarning
            >
              <Bell size={18} className="text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
            </button>

            {notifOpen && (
              <NotificationDropdown
                data={notifData}
                loading={notifLoading}
                streak={streak}
                onClose={() => setNotifOpen(false)}
              />
            )}
          </div>

          {/* Streak badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <span className="text-sm">🔥</span>
            <span className="text-orange-400 font-bold text-sm">{streak}</span>
            <span className="text-slate-600 text-xs">days</span>
          </div>

          {/* User (mobile only — desktop shows in sidebar) */}
          <div className="md:hidden">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Search overlay — rendered at top level so it covers everything */}
      {searchOpen && (
        <SearchOverlay
          query={searchQuery}
          onChange={setSearchQuery}
          results={searchResults}
          loading={searchLoading}
          onClose={closeSearch}
        />
      )}
    </>
  );
}
