import mongoose, { Schema, model, models } from "mongoose";

const SessionQuestionSchema = new Schema({
  questionId: String,
  question: { type: String, required: true },
  options: [String],
  correctAnswer: Number,
  userAnswer: Number,
  isCorrect: Boolean,
  timeTaken: Number,
  explanation: String,
  topic: String,
});

const RevisionSessionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    chapter: { type: String, required: true },
    questions: [SessionQuestionSchema],
    score: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }, // percentage
    timeTaken: { type: Number, default: 0 }, // seconds
    weakTopicsIdentified: [String],
    nextRevisionDate: Date,
    revisionCycle: { type: Number, default: 1, min: 1, max: 5 },
    completedAt: Date,
    isCompleted: { type: Boolean, default: false },
    xpEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for efficient queries
RevisionSessionSchema.index({ userId: 1, subject: 1 });
RevisionSessionSchema.index({ userId: 1, nextRevisionDate: 1 });
RevisionSessionSchema.index({ userId: 1, isCompleted: 1 });

export const RevisionSession = models.RevisionSession || model("RevisionSession", RevisionSessionSchema);
