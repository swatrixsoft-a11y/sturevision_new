"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { authedFetch } from "@/lib/authedFetch";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, Brain, Zap, Target } from "lucide-react";
import { cn } from "@/utils/cn";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

type QuizState = "loading" | "ready" | "playing" | "feedback" | "finished";

const OPTION_LABELS = ["A", "B", "C", "D"];
const DIFFICULTY_COLOR = {
  easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  hard: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function QuizPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const sessionId = searchParams.get("session");

  const [quizState, setQuizState] = useState<QuizState>("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [results, setResults] = useState<any>(null);

  // Load questions from session
  useEffect(() => {
    if (!sessionId) {
      router.push("/upload");
      return;
    }

    async function loadSession() {
      try {
        const res = await fetch(`/api/quiz/session/${sessionId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setQuestions(data.questions);
        setQuizState("ready");
      } catch {
        // Demo mode with sample questions if session not found
        setQuestions(SAMPLE_QUESTIONS);
        setQuizState("ready");
      }
    }

    loadSession();
  }, [sessionId, router]);

  // Timer
  useEffect(() => {
    if (quizState !== "playing") return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // Timeout
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, quizState]);

  const startQuiz = () => {
    setQuizState("playing");
    setQuestionStart(Date.now());
    setTimeLeft(30);
  };

  const handleAnswer = useCallback((optionIndex: number) => {
    if (quizState !== "playing") return;
    setSelectedAnswer(optionIndex);
    setQuizState("feedback");
    const timeTaken = Math.round((Date.now() - questionStart) / 1000);
    setQuestionTimes((prev) => [...prev, timeTaken]);
    setAnswers((prev) => [...prev, optionIndex]);
  }, [quizState, questionStart]);

  const nextQuestion = async () => {
    if (currentIndex + 1 >= questions.length) {
      // Submit
      setQuizState("finished");
      try {
        const res = await authedFetch(getToken, "/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, answers, timeTaken: questionTimes }),
        });
        const data = await res.json();
        setResults(data);
      } catch {
        // Compute local results
        const correct = answers.filter((a, i) => a === questions[i].correctAnswer).length;
        setResults({ score: correct, accuracy: Math.round((correct / questions.length) * 100), xpEarned: correct * 5 });
      }
      return;
    }

    setCurrentIndex((p) => p + 1);
    setSelectedAnswer(null);
    setQuizState("playing");
    setTimeLeft(30);
    setQuestionStart(Date.now());
  };

  const current = questions[currentIndex];
  const progress = ((currentIndex + (quizState === "finished" ? 1 : 0)) / questions.length) * 100;

  if (quizState === "loading") {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center animate-pulse">
          <Brain size={32} className="text-white" />
        </div>
        <p className="text-slate-500">Loading your quiz...</p>
      </div>
    );
  }

  if (quizState === "ready") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass-card rounded-3xl p-10 border border-white/5 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/30"
            style={{ animation: "float 3s ease-in-out infinite" }}>
            <Brain size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Quiz Ready!</h1>
          <p className="text-slate-400 mb-8">
            {questions.length} questions • 30 seconds each • Answer all to earn XP
          </p>

          <div className="flex justify-center gap-6 mb-10">
            {[
              { icon: "❓", label: `${questions.length} Questions` },
              { icon: "⏱️", label: "30s per question" },
              { icon: "⚡", label: "Earn XP" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <motion.button
            onClick={startQuiz}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-brand px-12 py-4 rounded-2xl text-lg font-black"
          >
            Start Quiz →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (quizState === "finished" && results) {
    return <QuizResults results={results} questions={questions} answers={answers} onRetry={() => router.push("/upload")} onDashboard={() => router.push("/dashboard")} />;
  }

  if (!current) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Progress header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className={cn("font-semibold capitalize px-2 py-0.5 rounded-full border text-xs", DIFFICULTY_COLOR[current.difficulty])}>
              {current.difficulty}
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #8b5cf6, #3b82f6)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className={cn(
          "w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all",
          timeLeft <= 10
            ? "bg-red-500/20 border-red-500/30 text-red-400"
            : "bg-white/5 border-white/10 text-white"
        )}>
          <Clock size={14} className="mb-0.5" />
          <span className="text-lg font-black leading-none">{timeLeft}</span>
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="glass-card rounded-2xl p-7 border border-white/5"
        >
          <div className="text-xs text-slate-600 font-medium mb-3">
            📌 {current.topic}
          </div>
          <h2 className="text-white font-bold text-xl leading-relaxed mb-7">
            {current.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {current.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === current.correctAnswer;
              const showResult = quizState === "feedback";

              let optionClass = "bg-white/5 border-white/10 text-slate-300 hover:bg-white/8 hover:border-white/20 cursor-pointer";
              if (showResult) {
                if (isCorrect) optionClass = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 cursor-default";
                else if (isSelected && !isCorrect) optionClass = "bg-red-500/20 border-red-500/40 text-red-300 cursor-default";
                else optionClass = "bg-white/3 border-white/5 text-slate-600 cursor-default";
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => quizState === "playing" && handleAnswer(i)}
                  whileHover={quizState === "playing" ? { scale: 1.01 } : {}}
                  whileTap={quizState === "playing" ? { scale: 0.99 } : {}}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                    optionClass
                  )}
                >
                  <span className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5",
                    showResult && isCorrect ? "bg-emerald-500 text-white" :
                    showResult && isSelected && !isCorrect ? "bg-red-500 text-white" :
                    "bg-white/10 text-slate-400"
                  )}>
                    {OPTION_LABELS[i]}
                  </span>
                  <span className="text-sm leading-relaxed">{option}</span>
                  {showResult && isCorrect && <span className="ml-auto text-emerald-400">✓</span>}
                  {showResult && isSelected && !isCorrect && <span className="ml-auto text-red-400">✗</span>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback / explanation */}
      <AnimatePresence>
        {quizState === "feedback" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "rounded-2xl p-5 border",
              selectedAnswer === current.correctAnswer
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20"
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{selectedAnswer === current.correctAnswer ? "✅" : "❌"}</span>
              <div className="flex-1">
                <p className={cn(
                  "font-bold text-sm mb-1",
                  selectedAnswer === current.correctAnswer ? "text-emerald-300" : "text-red-300"
                )}>
                  {selectedAnswer === current.correctAnswer ? "Correct! +5 XP" : selectedAnswer === -1 ? "Time's up!" : "Incorrect"}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">{current.explanation}</p>
              </div>
            </div>
            <motion.button
              onClick={nextQuestion}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-4 w-full btn-brand py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            >
              {currentIndex + 1 >= questions.length ? "See Results →" : "Next Question →"}
              <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizResults({ results, questions, answers, onRetry, onDashboard }: any) {
  const correctCount = answers.filter((a: number, i: number) => a === questions[i]?.correctAnswer).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto space-y-5"
    >
      {/* Score card */}
      <div className="glass-card rounded-3xl p-8 border border-white/5 text-center"
        style={{ background: results.accuracy >= 70 ? "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.05))" : "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(245,158,11,0.05))" }}>
        <div className="text-5xl mb-4">{results.accuracy >= 90 ? "🏆" : results.accuracy >= 70 ? "🎉" : results.accuracy >= 50 ? "💪" : "📚"}</div>
        <div className="text-6xl font-black gradient-text mb-2">{results.accuracy}%</div>
        <p className="text-slate-400 text-lg mb-6">
          {correctCount} out of {questions.length} correct
        </p>

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-black text-white flex items-center gap-1 justify-center">
              <Zap size={20} className="text-violet-400" />
              {results.xpEarned || 0}
            </div>
            <div className="text-slate-600 text-xs mt-1">XP Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-white">{correctCount}</div>
            <div className="text-slate-600 text-xs mt-1">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-white">{questions.length - correctCount}</div>
            <div className="text-slate-600 text-xs mt-1">Wrong</div>
          </div>
        </div>
      </div>

      {/* Weak topics */}
      {results.weakTopics?.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-orange-500/10">
          <h3 className="text-white font-bold flex items-center gap-2 mb-3">
            <Target size={16} className="text-orange-400" />
            Topics to Focus On
          </h3>
          <div className="flex flex-wrap gap-2">
            {results.weakTopics.map((topic: string) => (
              <span key={topic} className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Next revision */}
      {results.nextRevisionDate && (
        <div className="glass-card rounded-2xl p-4 border border-blue-500/10 flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-white font-semibold text-sm">Next revision scheduled</p>
            <p className="text-slate-500 text-xs">
              {new Date(results.nextRevisionDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <motion.button
          onClick={onDashboard}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex-1 btn-brand py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
        >
          Go to Dashboard
        </motion.button>
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex-1 py-4 rounded-2xl border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/5 transition-all"
        >
          New Quiz
        </motion.button>
      </div>
    </motion.div>
  );
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    question: "Which of the following best describes Newton's First Law of Motion?",
    options: ["F = ma", "An object at rest stays at rest unless acted upon by a force", "For every action there is an equal and opposite reaction", "Energy cannot be created or destroyed"],
    correctAnswer: 1,
    explanation: "Newton's First Law (Law of Inertia) states that an object remains in its current state of motion unless an external force acts upon it.",
    topic: "Laws of Motion",
    difficulty: "easy",
  },
  {
    question: "A 10 kg object accelerates at 5 m/s². What is the net force acting on it?",
    options: ["2 N", "15 N", "50 N", "500 N"],
    correctAnswer: 2,
    explanation: "Using F = ma: F = 10 kg × 5 m/s² = 50 N. Newton's Second Law directly gives us the relationship between force, mass and acceleration.",
    topic: "Laws of Motion",
    difficulty: "medium",
  },
  {
    question: "When a gun fires a bullet, the gun recoils backward. This is an example of:",
    options: ["First Law of Motion", "Second Law of Motion", "Third Law of Motion", "Law of Conservation of Energy"],
    correctAnswer: 2,
    explanation: "Newton's Third Law: For every action (bullet fired forward) there is an equal and opposite reaction (gun recoils backward).",
    topic: "Laws of Motion",
    difficulty: "easy",
  },
];
