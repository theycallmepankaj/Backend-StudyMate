// backend/controller/chat.controller.js
import { Chat } from "../model/chat.model.js";
import { Conversation } from "../model/conversation.model.js";

export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const convos = await Conversation.find({ participants: userId })
      .populate("participants", "name profile")
      .sort({ lastMessageTime: -1 });

    return res.status(200).json({ conversations: convos });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};


export const saveMessage = async (request, response, next) => {
  try {
    const { sender, receiver, message } = request.body;
    if (!sender || !receiver || !message) {
      return response.status(400).json({ errorMessage: "sender, receiver and message required" });
    }
    const newChat = new Chat({ sender, receiver, message });
    await newChat.save();
    return response.status(201).json({ message: "Message Saved Successfully", chat: newChat });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

export const getMessages = async (request, response, next) => {
  try {
    const Messages = await Chat.find().populate("sender", "name").populate("receiver", "name");
    return response.status(200).json({ message: "All Messages", Messages });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ errorMessage: "Internal Server Error" });
  }
};


export const getConversation = async (request, response, next) => {
  try {
    const { userId, otherId } = request.params;
    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId }
      ]
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });
    return response.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ errorMessage: "Internal Server Error" });
  }
};
