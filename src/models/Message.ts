import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    room: { type: String, required: true, index: true },
    sender: {
      userId: { type: String, required: true },
      name: { type: String, required: true },
      avatar: String,
    },
    content: { type: String, required: true, maxlength: 2000 },
    type: { type: String, enum: ["text", "note", "flashcard"], default: "text" },
    attachmentData: {
      front: String,
      back: String,
      subject: String,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ room: 1, createdAt: -1 });

export const Message = models.Message || model("Message", MessageSchema);
