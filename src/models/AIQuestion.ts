import { Schema, model, models } from "mongoose";

const AIQuestionSchema = new Schema(
  {
    subject: { type: String, required: true, index: true },
    chapter: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    topic: String,
    board: { type: String, default: "CBSE" },
    usageCount: { type: Number, default: 0 },
    cachedFrom: String, // hash of source content
  },
  { timestamps: true }
);

AIQuestionSchema.index({ subject: 1, chapter: 1, difficulty: 1 });
AIQuestionSchema.index({ cachedFrom: 1 });

export const AIQuestion = models.AIQuestion || model("AIQuestion", AIQuestionSchema);
