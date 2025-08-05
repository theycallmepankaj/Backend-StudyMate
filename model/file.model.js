import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileName:{
        type:String,
        required: true
    },
    fileUrl:{
        type:String,
        required:true
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },
    subject:{
        type:String,
        required:true
    },
    uploadedDate:{
        type:Date,
        default:Date.now
    }
});

export const File = mongoose.model("file",fileSchema);