"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  Brain,
  CreditCard,
  CheckCircle,
  X,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { SUBJECTS } from "@/types";

type Step = "upload" | "configure" | "generating" | "done";

const GENERATION_STEPS = [
  { label: "Reading your notes...", icon: "📖" },
  { label: "Understanding the content...", icon: "🧠" },
  { label: "Generating MCQ questions...", icon: "❓" },
  { label: "Creating flashcards...", icon: "🃏" },
  { label: "Building your revision kit...", icon: "✨" },
];

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [inputMode, setInputMode] = useState<"file" | "text">("file");

  // Config
  const [subject, setSubject] = useState("Physics");
  const [chapter, setChapter] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  // Generation
  const [genStep, setGenStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const hasContent = inputMode === "file" ? !!file : pastedText.trim().length > 50;

  const handleGenerate = async () => {
    if (!hasContent || !chapter.trim()) return;
    setStep("generating");
    setGenStep(0);

    // Simulate AI generation steps
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 900));
      setGenStep(i + 1);
    }

    try {
      let content = pastedText;

      // If file, read text from it
      if (inputMode === "file" && file) {
        content = await readFileText(file);
      }

      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, subject, chapter, count: questionCount, difficulty }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Generation failed");

      setResult(data);
      setStep("done");
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
      setStep("configure");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
          Upload & Generate
        </h1>
        <p className="text-slate-500">
          Turn your notes into a complete AI revision kit in seconds.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Upload */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Input mode toggle */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
              {(["file", "text"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setInputMode(mode)}
                  className={cn(
                    "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                    inputMode === mode
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {mode === "file" ? "📄 Upload PDF" : "📝 Paste Text"}
                </button>
              ))}
            </div>

            {inputMode === "file" ? (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
                  isDragActive
                    ? "border-violet-500 bg-violet-500/10"
                    : file
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-white/10 hover:border-violet-500/50 hover:bg-white/5"
                )}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle size={28} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{file.name}</p>
                      <p className="text-slate-500 text-sm">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1 mx-auto transition-colors"
                    >
                      <X size={12} /> Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto">
                      <Upload size={28} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {isDragActive ? "Drop it here!" : "Drag & drop your notes"}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        PDF or TXT • Max 10MB
                      </p>
                    </div>
                    <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors">
                      Browse files
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your chapter notes, textbook paragraphs, or any study material here...

Tip: More content = better quality questions. Aim for at least 200 words."
                  className="w-full h-64 bg-[#0f1629] border border-white/10 rounded-2xl p-4 text-sm text-slate-300 placeholder:text-slate-700 resize-none focus:outline-none focus:border-violet-500/40 transition-colors"
                />
                <span className="absolute bottom-3 right-4 text-xs text-slate-700">
                  {pastedText.length} chars
                </span>
              </div>
            )}

            <motion.button
              onClick={() => hasContent && setStep("configure")}
              disabled={!hasContent}
              whileHover={hasContent ? { scale: 1.01 } : {}}
              whileTap={hasContent ? { scale: 0.99 } : {}}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-white transition-all text-base",
                hasContent
                  ? "btn-brand"
                  : "bg-white/5 border border-white/5 text-slate-700 cursor-not-allowed"
              )}
            >
              Continue →
            </motion.button>
          </motion.div>
        )}

        {/* STEP 2: Configure */}
        {step === "configure" && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-violet-400" />
                Configure your revision kit
              </h2>

              {/* Subject */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">Subject</label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#0f1629] border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-violet-500/40 transition-colors"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Chapter */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Chapter / Topic Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Laws of Motion, Photosynthesis, French Revolution"
                  className="w-full bg-[#0f1629] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-700 focus:outline-none focus:border-violet-500/40 transition-colors"
                />
              </div>

              {/* Question count */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Number of Questions
                  <span className="ml-2 text-violet-400 font-bold">{questionCount}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
                <div className="flex justify-between text-xs text-slate-700 mt-1">
                  <span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">Difficulty</label>
                <div className="flex gap-3">
                  {(["easy", "medium", "hard"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all border",
                        difficulty === d
                          ? d === "easy"
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : d === "medium"
                            ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                            : "bg-red-500/20 border-red-500/40 text-red-300"
                          : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                      )}
                    >
                      {d === "easy" ? "😊 Easy" : d === "medium" ? "🧠 Medium" : "🔥 Hard"}
                    </button>
                  ))}
                </div>
              </div>

              {/* What will be generated */}
              <div className="bg-violet-500/5 border border-violet-500/10 rounded-xl p-4">
                <p className="text-slate-400 text-xs font-medium mb-2">Will generate:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                    🧠 {questionCount} MCQ Questions
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
                    🃏 ~15 Flashcards
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                    📅 Revision Schedule
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle size={18} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("upload")}
                className="px-6 py-3.5 rounded-2xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
              >
                ← Back
              </button>
              <motion.button
                onClick={handleGenerate}
                disabled={!chapter.trim()}
                whileHover={chapter.trim() ? { scale: 1.01 } : {}}
                whileTap={chapter.trim() ? { scale: 0.99 } : {}}
                className={cn(
                  "flex-1 py-3.5 rounded-2xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2",
                  chapter.trim() ? "btn-brand" : "bg-white/5 text-slate-700 cursor-not-allowed"
                )}
              >
                <Sparkles size={18} />
                Generate with AI
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Generating */}
        {step === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 border border-white/5 text-center"
          >
            {/* Animated brain */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-500/40"
                style={{ animation: "float 2s ease-in-out infinite" }}>
                <Brain size={44} className="text-white" />
              </div>
              <div className="absolute -inset-2 rounded-3xl border border-violet-500/30 animate-ping" />
            </div>

            <h2 className="text-white font-black text-2xl mb-2">AI is working...</h2>
            <p className="text-slate-500 text-sm mb-10">
              Generating your personalised revision kit for <span className="text-violet-400 font-medium">{chapter}</span>
            </p>

            {/* Generation steps */}
            <div className="space-y-3 max-w-xs mx-auto text-left">
              {GENERATION_STEPS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: genStep > i ? 1 : 0.3, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-300",
                    genStep > i
                      ? "bg-emerald-500/20 text-emerald-400"
                      : genStep === i
                      ? "bg-violet-500/20 text-violet-400 animate-pulse"
                      : "bg-white/5 text-slate-700"
                  )}>
                    {genStep > i ? "✓" : s.icon}
                  </div>
                  <span className={cn(
                    "text-sm transition-colors",
                    genStep > i ? "text-slate-300" : genStep === i ? "text-violet-300" : "text-slate-700"
                  )}>
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-8 max-w-xs mx-auto">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #8b5cf6, #3b82f6)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(genStep / GENERATION_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Done */}
        {step === "done" && result && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
          >
            {/* Success header */}
            <div className="glass-card rounded-2xl p-8 border border-emerald-500/20 text-center"
              style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.05))" }}>
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-white font-black text-2xl mb-2">Revision kit ready!</h2>
              <p className="text-slate-400 text-sm">
                Your AI has generated everything you need to master <span className="text-white font-medium">{chapter}</span>
              </p>
            </div>

            {/* What was created */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "🧠", label: "MCQ Questions", value: result.total, color: "violet", href: `/quiz?session=${result.sessionId}` },
                { icon: "🃏", label: "Flashcards", value: "~15", color: "blue", href: "/flashcards" },
                { icon: "📅", label: "Revision Days", value: "5", color: "emerald", href: "/scheduler" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="glass-card rounded-xl p-4 text-center border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-black text-white mb-1">{item.value}</div>
                  <div className="text-slate-500 text-xs">{item.label}</div>
                </a>
              ))}
            </div>

            {/* Primary CTA */}
            <motion.a
              href={`/quiz?session=${result.sessionId}`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full btn-brand flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold"
            >
              <Brain size={20} />
              Start Quiz Now
            </motion.a>

            <div className="flex gap-3">
              <a href="/flashcards" className="flex-1 py-3.5 rounded-2xl border border-white/10 text-slate-300 text-sm font-medium text-center hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                <CreditCard size={16} /> View Flashcards
              </a>
              <button
                onClick={() => { setStep("upload"); setFile(null); setPastedText(""); setChapter(""); setResult(null); }}
                className="flex-1 py-3.5 rounded-2xl border border-white/10 text-slate-300 text-sm font-medium hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <Upload size={16} /> Upload Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

async function readFileText(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string || "");
    reader.readAsText(file);
  });
}
