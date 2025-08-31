// backend/routes/chat.route.js
import express from "express";
import { getMessages, saveMessage, getConversation, getUserConversations } from "../controller/chat.controller.js";

const router = express.Router();

router.get("/conversations/:userId", getUserConversations);
router.post("/send", saveMessage); // optional REST save
router.get("/messages", getMessages); // all messages (optional)
router.get("/conversation/:userId/:otherId", getConversation); // new: messages between two users

export default router;
