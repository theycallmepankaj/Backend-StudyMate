// backend/app.js (or server entry file)
import express from "express";
import http from "http";
import mongoose from "mongoose";
import path, { dirname } from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

import userRouter from "./routes/user.route.js";
import teacherRouter from "./routes/teacher.route.js";
import studentRouter from "./routes/student.route.js";
import chatRouter from "./routes/chat.route.js";

import { Chat } from "./model/chat.model.js";
import { User } from "./model/user.model.js";
import { Conversation } from "./model/conversation.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: "http://localhost:3001",
  // methods: ["GET", "POST",'DELETE'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploadNotes", express.static(path.join(__dirname, "uploadNotes")));
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

app.use("/chat", chatRouter);
app.use("/user", userRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);


const onlineUsers = {};

async function emitOnlineUsers() {
  // produce array [{ id, name }]
  const ids = Object.keys(onlineUsers);
  const list = await Promise.all(ids.map(async (id) => {
    const u = await User.findById(id).select("name");
    return { id, name: u?.name || "Unknown" };
  }));
  io.emit("online_users", list);
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  socket.on("register", async (userId) => {
    if (!userId) return;
    onlineUsers[userId] = socket.id;
    console.log("Registered:", userId, "->", socket.id);
    await emitOnlineUsers();
  });

  socket.on("private_message", async (payload) => {
    try {
      const { tempId, senderId, receiverId, text } = payload;
      if (!senderId || !receiverId || !text) {
        return socket.emit("messageError", { tempId, error: "Invalid payload" });
      }


      const newChat = await Chat.create({ sender: senderId, receiver: receiverId, message: text });
      const populated = await Chat.findById(newChat._id).populate("sender", "name").populate("receiver", "name");
      
      // await Conversation.findOneAndUpdate(
      //   { participants: { $all: [senderId, receiverId] } },
      //   {
      //     $set: {
      //       lastMessage: text,
      //       lastMessageTime: new Date()
      //     },
      //     $setOnInsert: {
      //       participants: [senderId, receiverId]
      //     }
      //   },
      //   { upsert: true, new: true }
      // );



      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private_message", { tempId: null, message: populated });
      }


      socket.emit("private_message_sent", { tempId, message: populated });

    } catch (err) {
      console.error("private_message error:", err);
      socket.emit("messageError", { tempId: payload?.tempId, error: "Server error" });
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    for (const [uid, sid] of Object.entries(onlineUsers)) {
      if (sid === socket.id) {
        delete onlineUsers[uid];
        break;
      }
    }
    await emitOnlineUsers();
  });
});


mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB Connected ");
    const PORT = process.env.PORT_NUMBER || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("DB connection failed", err);
  });
