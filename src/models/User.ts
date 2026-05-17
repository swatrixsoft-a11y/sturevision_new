import mongoose, { Schema, model, models } from "mongoose";

const BadgeSchema = new Schema({
  id: String,
  name: String,
  description: String,
  icon: String,
  earnedAt: { type: Date, default: Date.now },
});

const WeakTopicSchema = new Schema({
  subject: String,
  topic: String,
  accuracy: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  lastAttempted: Date,
});

const RevisionQueueItemSchema = new Schema({
  sessionId: String,
  subject: String,
  chapter: String,
  nextRevisionDate: Date,
  cycle: { type: Number, default: 1 },
  score: Number,
});

const SubscriptionSchema = new Schema({
  plan: { type: String, enum: ["free", "pro", "premium", "school"], default: "free" },
  status: { type: String, enum: ["active", "cancelled", "expired"], default: "active" },
  startDate: Date,
  expiresAt: Date,
  razorpaySubscriptionId: String,
});

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: String,
    grade: { type: String, default: "10" },
    board: { type: String, enum: ["CBSE", "ICSE", "STATE"], default: "CBSE" },
    subjects: { type: [String], default: ["Mathematics", "Physics", "Chemistry"] },

    // Gamification
    streakCount: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    xpPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: { type: [BadgeSchema], default: [] },

    // Learning data
    subscription: { type: SubscriptionSchema, default: () => ({}) },
    weakTopics: { type: [WeakTopicSchema], default: [] },
    revisionQueue: { type: [RevisionQueueItemSchema], default: [] },

    // Referral
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: String,
    referralCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Update streak on activity
UserSchema.methods.updateStreak = function () {
  const now = new Date();
  const lastActive = new Date(this.lastActiveDate);
  const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    this.streakCount += 1;
    if (this.streakCount > this.longestStreak) {
      this.longestStreak = this.streakCount;
    }
  } else if (diffDays > 1) {
    this.streakCount = 1;
  }
  this.lastActiveDate = now;
};

// Add XP and level up
UserSchema.methods.addXP = function (xp: number) {
  this.xpPoints += xp;
  this.level = Math.floor(this.xpPoints / 500) + 1;
};

export const User = models.User || model("User", UserSchema);
