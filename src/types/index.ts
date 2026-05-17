// ============================================
// STUREVISION — Global TypeScript Types
// ============================================

export interface User {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  avatar?: string;
  grade: string;
  board: "CBSE" | "ICSE" | "STATE";
  subjects: string[];
  streakCount: number;
  longestStreak: number;
  lastActiveDate: Date;
  xpPoints: number;
  level: number;
  badges: Badge[];
  subscription: Subscription;
  weakTopics: WeakTopic[];
  revisionQueue: RevisionQueueItem[];
  createdAt: Date;
}

export interface Subscription {
  plan: "free" | "pro" | "premium" | "school";
  status: "active" | "cancelled" | "expired";
  startDate?: Date;
  expiresAt?: Date;
  razorpaySubscriptionId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface WeakTopic {
  subject: string;
  topic: string;
  accuracy: number; // 0-100
  attempts: number;
  lastAttempted: Date;
}

export interface RevisionQueueItem {
  sessionId: string;
  subject: string;
  chapter: string;
  nextRevisionDate: Date;
  cycle: number;
  score: number;
}

export interface RevisionSession {
  _id: string;
  userId: string;
  subject: string;
  chapter: string;
  questions: SessionQuestion[];
  score: number;
  accuracy: number;
  timeTaken: number; // seconds
  weakTopicsIdentified: string[];
  nextRevisionDate: Date;
  revisionCycle: number;
  completedAt: Date;
  createdAt: Date;
}

export interface SessionQuestion {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
  explanation: string;
  topic: string;
}

export interface Flashcard {
  _id: string;
  userId: string;
  subject: string;
  chapter?: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  aiGenerated: boolean;
  // SM-2 fields
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  reviewHistory: FlashcardReview[];
  tags: string[];
  isShared: boolean;
  createdAt: Date;
}

export interface FlashcardReview {
  rating: 0 | 1 | 2 | 3;
  reviewedAt: Date;
}

export interface AIQuestion {
  _id: string;
  subject: string;
  chapter: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  board: string;
  usageCount: number;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  xpPoints: number;
  streakCount: number;
  level: number;
  rank: number;
  subject?: string;
}

export type PricingPlan = {
  id: "free" | "pro" | "premium" | "school";
  name: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Political Science",
  "Economics",
  "English",
  "Hindi",
  "Computer Science",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const GRADES = ["9", "10", "11", "12"] as const;
export type Grade = (typeof GRADES)[number];

export const XP_PER_LEVEL = 500;
export function getLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export const BADGE_DEFINITIONS = {
  first_quiz: { name: "First Quiz!", description: "Completed your first quiz", icon: "🎯" },
  streak_7: { name: "Week Warrior", description: "7-day streak", icon: "🔥" },
  streak_30: { name: "Monthly Master", description: "30-day streak", icon: "⚡" },
  perfect_score: { name: "Perfect!", description: "100% on a quiz", icon: "💯" },
  flashcard_100: { name: "Card Shark", description: "Reviewed 100 flashcards", icon: "🃏" },
  top_leaderboard: { name: "Top Student", description: "Reached top 10", icon: "🏆" },
};
