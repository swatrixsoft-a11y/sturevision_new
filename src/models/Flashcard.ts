import { Schema, model, models } from "mongoose";

const FlashcardReviewSchema = new Schema({
  rating: { type: Number, min: 0, max: 3 },
  reviewedAt: { type: Date, default: Date.now },
});

const FlashcardSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    chapter: String,
    front: { type: String, required: true },
    back: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    aiGenerated: { type: Boolean, default: false },

    // SM-2 Spaced Repetition
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 1 },
    repetitions: { type: Number, default: 0 },
    nextReviewDate: { type: Date, default: Date.now },

    reviewHistory: [FlashcardReviewSchema],
    tags: [String],
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FlashcardSchema.index({ userId: 1, nextReviewDate: 1 });
FlashcardSchema.index({ userId: 1, subject: 1 });

export const Flashcard = models.Flashcard || model("Flashcard", FlashcardSchema);
