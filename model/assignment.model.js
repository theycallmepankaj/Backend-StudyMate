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
            submittedAt:Date,
            status: {
            type: String,
            enum: ["Not Started", "In Progress", "Submitted"],
            default: "Not Started"
        },
        }
    ]
});

export const Assignment = mongoose.model("assignment",assignmentSchema);