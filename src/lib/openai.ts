import OpenAI from "openai";
import { redis } from "./redis";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- AI MCQ Generation ---
export async function generateMCQs(
  content: string,
  subject: string,
  chapter: string,
  count: number = 10,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<MCQQuestion[]> {
  const cacheKey = `mcq:${subject}:${chapter}:${difficulty}:${content.slice(0, 100)}`;

  // Check Redis cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(decodeURIComponent(cached));
    } catch {
      // Cache miss or parse error — continue to generate
    }
  }

  const prompt = `You are an expert ${subject} teacher for CBSE students.

Generate exactly ${count} multiple choice questions from this content:
"""
${content.slice(0, 3000)}
"""

Chapter: ${chapter}
Difficulty: ${difficulty}

Return a JSON array with this exact structure:
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

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const rawContent = response.choices[0].message.content || "[]";

  let questions: MCQQuestion[] = [];
  try {
    const parsed = JSON.parse(rawContent);
    questions = Array.isArray(parsed) ? parsed : parsed.questions || [];
  } catch {
    questions = [];
  }

  // Cache for 24 hours
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

Return a JSON array:
[
  {
    "front": "Question or term on front of card",
    "back": "Answer or definition on back of card",
    "topic": "topic name",
    "difficulty": "easy" | "medium" | "hard"
  }
]

Make cards concise. Front should be a question or key term. Back should be the answer or explanation.
Return ONLY the JSON array.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const rawContent = response.choices[0].message.content || "[]";

  try {
    const parsed = JSON.parse(rawContent);
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

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return response.choices[0].message.content || "";
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
