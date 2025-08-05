import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title:String,
    message:String,
    postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
});


export const Announcement = mongoose.model("announcement",announcementSchema);