"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw, Plus, Zap, Loader2, Upload } from "lucide-react";
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

const RATING_CONFIG = [
  { rating: 0 as Rating, label: "Again", emoji: "😓", color: "bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30" },
  { rating: 1 as Rating, label: "Hard", emoji: "😰", color: "bg-orange-500/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/30" },
  { rating: 2 as Rating, label: "Good", emoji: "😊", color: "bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30" },
  { rating: 3 as Rating, label: "Easy", emoji: "😎", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30" },
];

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

  const handleFlip = () => setIsFlipped((f) => !f);

  const handleRate = async (rating: Rating) => {
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
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
    setSessionDone(false);
    setXpEarned(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="text-violet-400 animate-spin" />
      </div>
    );
  }

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

  if (cards.length === 0 && !sessionDone) {
    return (
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
                  view === v ? "bg-violet-600/20 text-violet-300 border border-violet-500/20" : "text-slate-500 hover:text-slate-300 border border-white/5"
                )}
              >
                {v === "study" ? "📖 Study" : "🗂️ Browse"}
              </button>
            ))}
          </div>
        </div>

        {view === "browse" && allCards.length > 0 ? (
          <div className="space-y-3">
            {allCards.map((card, i) => (
              <motion.div
                key={card._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm mb-2">{card.front}</p>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{card.back}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full border flex-shrink-0",
                    card.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    card.difficulty === "medium" ? "bg-violet-500/10 text-violet-400 border-violet-500/20" :
                    "bg-red-500/10 text-red-400 border-red-500/20"
                  )}>
                    {card.difficulty}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-16 border border-white/5 text-center">
            <div className="text-5xl mb-4">🃏</div>
            <h2 className="text-2xl font-black text-white mb-2">
              {allCards.length > 0 ? "All caught up!" : "No flashcards yet"}
            </h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              {allCards.length > 0
                ? `You have ${allCards.length} card${allCards.length !== 1 ? "s" : ""} but none are due today. Check back tomorrow!`
                : "Generate flashcards from your notes to start building your memory bank."}
            </p>
            {allCards.length === 0 && (
              <Link href="/upload" className="inline-flex items-center gap-2 btn-brand px-6 py-3 rounded-xl font-bold text-sm">
                <Upload size={16} /> Upload Notes
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Flashcards</h1>
          <p className="text-slate-500 text-sm">{cards.length} card{cards.length !== 1 ? "s" : ""} due today</p>
        </div>
        <div className="flex gap-2">
          {(["study", "browse"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all",
                view === v ? "bg-violet-600/20 text-violet-300 border border-violet-500/20" : "text-slate-500 hover:text-slate-300 border border-white/5 hover:border-white/10"
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

          {/* Flashcard */}
          <div className="flashcard-scene h-72 md:h-80 cursor-pointer" onClick={handleFlip}>
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
                  <div className="flashcard-front glass-card rounded-2xl border border-white/8 p-8 flex flex-col justify-between"
                    style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05))" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                        {current?.subject}
                      </span>
                      <span className="text-xs text-slate-600">Tap to reveal →</span>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-4">❓</div>
                      <p className="text-white font-bold text-xl leading-relaxed">{current?.front}</p>
                    </div>
                    <div className="text-center text-slate-700 text-xs">Card {currentIndex + 1} of {cards.length}</div>
                  </div>

                  {/* Back */}
                  <div className="flashcard-back glass-card rounded-2xl border border-emerald-500/15 p-8 flex flex-col justify-between"
                    style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.05))" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        Answer
                      </span>
                      <span className="text-xs text-slate-600">How well did you know this?</span>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-4">💡</div>
                      <p className="text-slate-200 text-base leading-relaxed whitespace-pre-line">{current?.back}</p>
                    </div>
                    <div className="text-center text-slate-700 text-xs">Rate your answer below</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {!isFlipped && (
            <p className="text-center text-slate-600 text-sm">Tap the card to reveal the answer</p>
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
                {RATING_CONFIG.map(({ rating, label, emoji, color }) => (
                  <motion.button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn("py-4 rounded-xl border font-bold text-sm transition-all flex flex-col items-center gap-1", color)}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span>{label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Browse view */
        <div className="space-y-3">
          {(allCards.length > 0 ? allCards : cards).map((card, i) => (
            <motion.div
              key={card._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white font-medium text-sm mb-2">{card.front}</p>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{card.back}</p>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full border flex-shrink-0",
                  card.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  card.difficulty === "medium" ? "bg-violet-500/10 text-violet-400 border-violet-500/20" :
                  "bg-red-500/10 text-red-400 border-red-500/20"
                )}>
                  {card.difficulty}
                </span>
              </div>
            </motion.div>
          ))}
          <button className="w-full py-4 rounded-xl border border-dashed border-white/10 text-slate-500 hover:border-violet-500/30 hover:text-violet-400 transition-all flex items-center justify-center gap-2 text-sm">
            <Plus size={16} /> Add new flashcard
          </button>
        </div>
      )}
    </div>
  );
}
