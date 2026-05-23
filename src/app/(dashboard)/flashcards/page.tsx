"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw, Plus, Zap, Loader2, Upload, X, Keyboard } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface Flashcard {
  _id: string;
  front: string;
  back: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  nextReviewDate: string;
  repetitions: number;
}

type Rating = 0 | 1 | 2 | 3;

const RATING_CONFIG: {
  rating: Rating;
  label: string;
  emoji: string;
  color: string;
  key: string;
}[] = [
  { rating: 0, label: "Again",  emoji: "😓", key: "1", color: "bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30" },
  { rating: 1, label: "Hard",   emoji: "😰", key: "2", color: "bg-orange-500/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/30" },
  { rating: 2, label: "Good",   emoji: "😊", key: "3", color: "bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30" },
  { rating: 3, label: "Easy",   emoji: "😎", key: "4", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30" },
];

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "History", "Geography", "English", "Computer Science", "Other",
];

// ── Create flashcard modal ─────────────────────────────────────────────────

function CreateCardModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (card: Flashcard) => void;
}) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [customSubject, setCustomSubject] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) {
      setError("Both question and answer are required.");
      return;
    }
    setSaving(true);
    setError("");

    const finalSubject = subject === "Other" ? customSubject.trim() || "General" : subject;

    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: finalSubject,
          cards: [{ front: front.trim(), back: back.trim(), topic: front.trim(), difficulty }],
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const data = await res.json();
      onCreated(data.cards[0]);
      onClose();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#0f1629] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-bold text-white">Create Flashcard</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Subject</label>
            <div className="flex gap-2">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/40"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s} className="bg-[#0f1629]">
                    {s}
                  </option>
                ))}
              </select>
              {subject === "Other" && (
                <input
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter subject…"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500/40"
                />
              )}
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">
              Question (front)
            </label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="What is Newton's second law of motion?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500/40 resize-none"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">
              Answer (back)
            </label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Force = mass × acceleration (F = ma)"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500/40 resize-none"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">
              Difficulty
            </label>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "flex-1 py-2 rounded-xl border text-sm font-medium capitalize transition-all",
                    difficulty === d
                      ? d === "easy"
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : d === "medium"
                        ? "bg-violet-500/20 border-violet-500/30 text-violet-300"
                        : "bg-red-500/20 border-red-500/30 text-red-300"
                      : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-brand py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {saving ? "Saving…" : "Create Card"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Keyboard hint pill ─────────────────────────────────────────────────────

function KeyHint({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-slate-500 font-mono">
      {children}
    </kbd>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [view, setView] = useState<"study" | "browse">("study");
  const [xpEarned, setXpEarned] = useState(0);
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/flashcards?due=true").then((r) => r.json()),
      fetch("/api/flashcards").then((r) => r.json()),
    ])
      .then(([due, all]) => {
        setCards(due.cards || []);
        setAllCards(all.cards || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const current = cards[currentIndex];
  const progress = cards.length > 0 ? (reviewedCount / cards.length) * 100 : 0;

  const handleFlip = useCallback(() => setIsFlipped((f) => !f), []);

  const handleRate = useCallback(
    async (rating: Rating) => {
      if (!current) return;
      setReviewedCount((p) => p + 1);
      setXpEarned((p) => p + [0, 5, 10, 15][rating]);

      fetch(`/api/flashcards/${current._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      }).catch(() => {});

      if (currentIndex + 1 >= cards.length) {
        setSessionDone(true);
      } else {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((p) => p + 1), 150);
      }
    },
    [current, currentIndex, cards.length]
  );

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
    setSessionDone(false);
    setXpEarned(0);
  };

  // Keyboard shortcuts for study mode
  useEffect(() => {
    if (view !== "study" || loading || sessionDone) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!isFlipped) {
          handleFlip();
        }
      }
      if (isFlipped) {
        if (e.key === "1") handleRate(0);
        if (e.key === "2") handleRate(1);
        if (e.key === "3") handleRate(2);
        if (e.key === "4") handleRate(3);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, loading, sessionDone, isFlipped, handleFlip, handleRate]);

  const browsedCards =
    subjectFilter === "all"
      ? allCards
      : allCards.filter((c) => c.subject === subjectFilter);

  const subjects = Array.from(new Set(allCards.map((c) => c.subject)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="text-violet-400 animate-spin" />
      </div>
    );
  }

  // Session complete screen
  if (sessionDone) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-12 border border-white/5 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-white mb-2">Session Complete!</h2>
          <p className="text-slate-400 mb-8">You reviewed all {cards.length} cards</p>

          <div className="flex justify-center gap-10 mb-10">
            <div className="text-center">
              <div className="text-3xl font-black text-white flex items-center gap-1 justify-center">
                <Zap size={24} className="text-violet-400" />
                {xpEarned}
              </div>
              <div className="text-slate-600 text-sm mt-1">XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">{cards.length}</div>
              <div className="text-slate-600 text-sm mt-1">Cards Reviewed</div>
            </div>
          </div>

          <div className="flex gap-3 max-w-sm mx-auto">
            <button
              onClick={resetSession}
              className="flex-1 btn-brand py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Review Again
            </button>
            <button
              onClick={() => setView("browse")}
              className="flex-1 py-3.5 rounded-2xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-all"
            >
              Browse All
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (cards.length === 0 && !sessionDone) {
    return (
      <>
        <AnimatePresence>
          {showCreateModal && (
            <CreateCardModal
              onClose={() => setShowCreateModal(false)}
              onCreated={(card) => {
                setAllCards((prev) => [card, ...prev]);
              }}
            />
          )}
        </AnimatePresence>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Flashcards</h1>
              <p className="text-slate-500 text-sm">0 cards due today</p>
            </div>
            <div className="flex gap-2">
              {(["study", "browse"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all",
                    view === v
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                      : "text-slate-500 hover:text-slate-300 border border-white/5"
                  )}
                >
                  {v === "study" ? "📖 Study" : "🗂️ Browse"}
                </button>
              ))}
            </div>
          </div>

          {view === "browse" && allCards.length > 0 ? (
            <BrowseView
              cards={browsedCards}
              allCards={allCards}
              subjects={subjects}
              subjectFilter={subjectFilter}
              onFilterChange={setSubjectFilter}
              onCreateClick={() => setShowCreateModal(true)}
              onCardCreated={(card) => setAllCards((prev) => [card, ...prev])}
            />
          ) : (
            <div className="glass-card rounded-3xl p-16 border border-white/5 text-center">
              <div className="text-5xl mb-4">🃏</div>
              <h2 className="text-2xl font-black text-white mb-2">
                {allCards.length > 0 ? "All caught up!" : "No flashcards yet"}
              </h2>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                {allCards.length > 0
                  ? `You have ${allCards.length} card${allCards.length !== 1 ? "s" : ""} but none are due today. Check back tomorrow!`
                  : "Generate flashcards from your notes, or create one manually below."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <Link
                  href="/upload"
                  className="flex-1 inline-flex items-center justify-center gap-2 btn-brand px-5 py-3 rounded-xl font-bold text-sm"
                >
                  <Upload size={16} /> Upload Notes
                </Link>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-all"
                >
                  <Plus size={16} /> Create Manually
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ── Study view ─────────────────────────────────────────────────────────────
  return (
    <>
      <AnimatePresence>
        {showCreateModal && (
          <CreateCardModal
            onClose={() => setShowCreateModal(false)}
            onCreated={(card) => setAllCards((prev) => [card, ...prev])}
          />
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Flashcards</h1>
            <p className="text-slate-500 text-sm">
              {cards.length} card{cards.length !== 1 ? "s" : ""} due today
            </p>
          </div>
          <div className="flex gap-2">
            {(["study", "browse"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all",
                  view === v
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                    : "text-slate-500 hover:text-slate-300 border border-white/5 hover:border-white/10"
                )}
              >
                {v === "study" ? "📖 Study" : "🗂️ Browse"}
              </button>
            ))}
          </div>
        </div>

        {view === "study" ? (
          <>
            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>{reviewedCount} reviewed</span>
                <span>{cards.length - reviewedCount} remaining</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #8b5cf6, #3b82f6)" }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Card */}
            <div
              className="flashcard-scene h-72 md:h-80 cursor-pointer"
              onClick={handleFlip}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  <div className={cn("flashcard-card w-full h-full", isFlipped && "flipped")}>
                    {/* Front */}
                    <div
                      className="flashcard-front glass-card rounded-2xl border border-white/8 p-8 flex flex-col justify-between"
                      style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05))" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                          {current?.subject}
                        </span>
                        <span className="text-xs text-slate-600">Space to reveal</span>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl mb-4">❓</div>
                        <p className="text-white font-bold text-xl leading-relaxed">{current?.front}</p>
                      </div>
                      <div className="text-center text-slate-700 text-xs">
                        Card {currentIndex + 1} of {cards.length}
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      className="flashcard-back glass-card rounded-2xl border border-emerald-500/15 p-8 flex flex-col justify-between"
                      style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.05))" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          Answer
                        </span>
                        <span className="text-xs text-slate-600">Rate: 1 · 2 · 3 · 4</span>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl mb-4">💡</div>
                        <p className="text-slate-200 text-base leading-relaxed whitespace-pre-line">
                          {current?.back}
                        </p>
                      </div>
                      <div className="text-center text-slate-700 text-xs">
                        Rate your answer below
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Hint row */}
            {!isFlipped ? (
              <p className="text-center text-slate-600 text-sm flex items-center justify-center gap-2">
                <Keyboard size={14} />
                <span>
                  <KeyHint>Space</KeyHint> or tap card to reveal answer
                </span>
              </p>
            ) : (
              <p className="text-center text-slate-600 text-xs flex items-center justify-center gap-1.5">
                Press <KeyHint>1</KeyHint><KeyHint>2</KeyHint><KeyHint>3</KeyHint><KeyHint>4</KeyHint> to rate
              </p>
            )}

            {/* Rating buttons */}
            <AnimatePresence>
              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="grid grid-cols-4 gap-3"
                >
                  {RATING_CONFIG.map(({ rating, label, emoji, color, key }) => (
                    <motion.button
                      key={rating}
                      onClick={() => handleRate(rating)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "py-4 rounded-xl border font-bold text-sm transition-all flex flex-col items-center gap-1 relative",
                        color
                      )}
                    >
                      <span className="absolute top-1.5 right-2 text-[9px] opacity-50">{key}</span>
                      <span className="text-2xl">{emoji}</span>
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <BrowseView
            cards={browsedCards}
            allCards={allCards}
            subjects={subjects}
            subjectFilter={subjectFilter}
            onFilterChange={setSubjectFilter}
            onCreateClick={() => setShowCreateModal(true)}
            onCardCreated={(card) => setAllCards((prev) => [card, ...prev])}
          />
        )}
      </div>
    </>
  );
}

// ── Browse view sub-component ──────────────────────────────────────────────

function BrowseView({
  cards,
  allCards,
  subjects,
  subjectFilter,
  onFilterChange,
  onCreateClick,
  onCardCreated,
}: {
  cards: Flashcard[];
  allCards: Flashcard[];
  subjects: string[];
  subjectFilter: string;
  onFilterChange: (s: string) => void;
  onCreateClick: () => void;
  onCardCreated: (card: Flashcard) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Subject filter pills */}
      {subjects.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onFilterChange("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              subjectFilter === "all"
                ? "bg-violet-600/20 text-violet-300 border-violet-500/20"
                : "text-slate-500 border-white/10 hover:text-slate-300"
            )}
          >
            All ({allCards.length})
          </button>
          {subjects.map((s) => {
            const count = allCards.filter((c) => c.subject === s).length;
            return (
              <button
                key={s}
                onClick={() => onFilterChange(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  subjectFilter === s
                    ? "bg-violet-600/20 text-violet-300 border-violet-500/20"
                    : "text-slate-500 border-white/10 hover:text-slate-300"
                )}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Cards list */}
      <div className="space-y-3">
        {cards.length === 0 ? (
          <div className="text-center py-10 text-slate-600 text-sm">
            No cards in this subject yet.
          </div>
        ) : (
          cards.map((card, i) => (
            <motion.div
              key={card._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-xl border border-white/5 hover:border-white/10 transition-all overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === card._id ? null : card._id)}
                className="w-full flex items-start gap-4 p-5 text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm mb-1">{card.front}</p>
                  {expandedId !== card._id && (
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{card.back}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full border",
                      card.difficulty === "easy"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : card.difficulty === "medium"
                        ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    )}
                  >
                    {card.difficulty}
                  </span>
                </div>
              </button>

              {/* Expanded answer */}
              <AnimatePresence>
                {expandedId === card._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5"
                  >
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-xs text-emerald-400 font-medium mb-1.5">Answer</p>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{card.back}</p>
                      <p className="text-xs text-slate-600 mt-2">{card.subject}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}

        {/* Create button */}
        <button
          onClick={onCreateClick}
          className="w-full py-4 rounded-xl border border-dashed border-white/10 text-slate-500 hover:border-violet-500/30 hover:text-violet-400 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} /> Create new flashcard
        </button>
      </div>
    </div>
  );
}
