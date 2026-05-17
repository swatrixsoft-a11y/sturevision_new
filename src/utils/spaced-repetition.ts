// SM-2 Spaced Repetition Algorithm
// Used for flashcard scheduling

export type Rating = 0 | 1 | 2 | 3; // Again=0, Hard=1, Good=2, Easy=3

export interface SM2Card {
  easeFactor: number;     // Default 2.5
  interval: number;       // Days until next review
  repetitions: number;    // Number of successful reviews
  nextReviewDate: Date;
}

export function calculateNextReview(card: SM2Card, rating: Rating): SM2Card {
  let { easeFactor, interval, repetitions } = card;

  if (rating < 2) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02))
  );

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return { easeFactor, interval, repetitions, nextReviewDate };
}

// Sturevision spaced revision schedule (different from SM-2 — for quiz sessions)
export const REVISION_SCHEDULE = [
  { cycle: 1, daysAfter: 0, label: "Today" },
  { cycle: 2, daysAfter: 1, label: "Tomorrow" },
  { cycle: 3, daysAfter: 3, label: "In 3 days" },
  { cycle: 4, daysAfter: 7, label: "Next week" },
  { cycle: 5, daysAfter: 15, label: "In 15 days" },
];

export function getNextRevisionDate(cycle: number): Date {
  const schedule = REVISION_SCHEDULE.find((s) => s.cycle === cycle);
  const daysAfter = schedule?.daysAfter ?? 30;
  const date = new Date();
  date.setDate(date.getDate() + daysAfter);
  return date;
}

export function isDueToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d <= today;
}
