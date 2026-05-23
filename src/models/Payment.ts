import { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    planId: { type: String, required: true },
    plan: { type: String, enum: ["pro", "premium"], required: true },
    amount: { type: Number, required: true }, // in paise (₹99 = 9900)
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "captured", "failed", "refunded"],
      default: "created",
    },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, createdAt: -1 });

export const Payment = models.Payment || model("Payment", PaymentSchema);
