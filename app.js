import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import teaherRouter from "./routes/teacher.route.js"
import studentRouter from "./routes/student.route.js";
dotenv.config();

const app = express();

mongoose.connect(process.env.DB_URL)
.then(result=>{
    app.use(cors({
        origin:"http://localhost:3001",
        credentials:true
    }))
    app.use(cookieParser());
    app.use(express.static("public"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use("/user",userRouter);
    app.use("/teacher",teaherRouter);
    app.use("/student",studentRouter);
    app.listen(process.env.PORT_NUMBER,()=>{
        console.log("Server Started....");
    })
}).catch(err=>{
    console.log(err);
    console.log("Database Connection Failed...");
});


