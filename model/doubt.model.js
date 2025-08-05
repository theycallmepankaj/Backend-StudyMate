import mongoose, { Schema } from "mongoose";

const doubtSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subject: {
        type: String
    },
    description:{
        type: String
    },
    answers: [
        {
            answerText: String,
            answerBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            answeredAt: Date
        }
    ],
    createdAt: {
    type: Date,
    default: Date.now
  }
});


export const Doubt = mongoose.model("doubt", doubtSchema);