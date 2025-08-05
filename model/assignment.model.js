import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title:String,
    description:String,
    dueDate:Date,
    subject:String,
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    submissions : [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            fileUrl:String,
            submittedAt:Date
        }
    ]
});

export const Assignment = mongoose.model("assignment",assignmentSchema);