import { GoogleGenerativeAI } from "@google/generative-ai";
import { redis } from "./redis";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function askGemini(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// --- AI MCQ Generation ---
export async function generateMCQs(
  content: string,
  subject: string,
  chapter: string,
  count: number = 10,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<MCQQuestion[]> {
  const cacheKey = `mcq:${subject}:${chapter}:${difficulty}:${content.slice(0, 100)}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(decodeURIComponent(cached));
    } catch {
      // Cache miss — continue to generate
    }
  }

  const prompt = `You are an expert ${subject} teacher for CBSE students.

Generate exactly ${count} multiple choice questions from this content:
"""
${content.slice(0, 3000)}
"""

Chapter: ${chapter}
Difficulty: ${difficulty}

Return ONLY a valid JSON array with this exact structure, no markdown, no explanation:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct",
    "topic": "specific topic name",
    "difficulty": "${difficulty}"
  }
]

Rules:
- correctAnswer is the index (0-3) of the correct option
- Make options plausible and not obviously wrong
- Explanation should be 1-2 sentences
- Questions should test understanding, not just memorization
- Return ONLY the JSON array, no other text`;

  const rawContent = await askGemini(prompt);

  let questions: MCQQuestion[] = [];
  try {
    const clean = rawContent.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    questions = Array.isArray(parsed) ? parsed : parsed.questions || [];
  } catch {
    questions = [];
  }

  if (questions.length > 0) {
    await redis.set(cacheKey, JSON.stringify(questions), 86400);
  }

  return questions;
}

// --- Flashcard Generation ---
export async function generateFlashcards(
  content: string,
  subject: string,
  count: number = 15
): Promise<FlashcardData[]> {
  const prompt = `You are an expert ${subject} teacher creating revision flashcards for CBSE students.

Generate exactly ${count} flashcards from this content:
"""
${content.slice(0, 3000)}
"""

Return ONLY a valid JSON array, no markdown, no explanation:
[
  {
    "front": "Question or term on front of card",
    "back": "Answer or definition on back of card",
    "topic": "topic name",
    "difficulty": "easy"
  }
]

difficulty must be one of: easy, medium, hard
Return ONLY the JSON array.`;

  const rawContent = await askGemini(prompt);

  try {
    const clean = rawContent.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed) ? parsed : parsed.flashcards || [];
  } catch {
    return [];
  }
}

// --- Summary Generation ---
export async function generateSummary(content: string, subject: string): Promise<string> {
  const prompt = `Summarize this ${subject} content for CBSE revision:
"""
${content.slice(0, 4000)}
"""

Create a concise bullet-point summary with:
- Key concepts (3-5 points)
- Important formulas or definitions
- Things to remember for exams

Keep it under 300 words. Use simple, clear language.`;

  return await askGemini(prompt);
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface FlashcardData {
  front: string;
  back: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}
