import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    description:String,
    fileUrl:{
        type:String,
        required:true
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});


export const Note = mongoose.model("note",noteSchema);