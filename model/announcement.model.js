import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title:String,
    message:String,
    postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    uploadedAt: { 
        type: String, required:true
    }
});


export const Announcement = mongoose.model("announcement",announcementSchema);