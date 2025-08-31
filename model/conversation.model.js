import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  lastMessage: { type: String },
  lastMessageTime: { type: Date, default: Date.now }
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
