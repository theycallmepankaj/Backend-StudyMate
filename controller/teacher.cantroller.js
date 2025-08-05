import { Announcement } from "../model/announcement.model.js";
import { Assignment } from "../model/assignment.model.js";
import { Note } from "../model/note.model.js";
import { Doubt } from "../model/doubt.model.js";


export const getAllDoubts = async (request, response,next) => {
    try {
        const doubts = await Doubt.find().populate("askedBy", "name email profile.imageName").sort({ createdAt: -1 });
        console.log(doubts);
        if (!doubts || doubts.length === 0) {
            return response.status(404).json({success: false,message: "Doubts not found"});
        }

        return response.status(200).json({success: true,doubts});

    } catch (error) {
        console.error("Error fetching doubts:", error);
        return response.status(500).json({success: false,message: "Internal server error"});
    }
};


export const getTeacherDashboard = async(request,response,next)=>{
    try{
    const teacherId = request.user.id;

    const assignments = await Assignment.find({createdBy:teacherId});
    const notes = await Note.find({uploadedBy:teacherId});
   
    return response.status(200).json({success: true, message:"Dashboard loaded",data:{assignments,notes}});
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internal Server Error"});
    }
}

export const uploadNote = async (request, response, next)=>{
    try{
       const {title,subject,description,fileUrl,uploadedBy} = request.body;
       const newNote = await Note.create({title,subject,description,fileUrl,uploadedBy});
       return response.status(200).json({Message:"Note Uploaded Successfully..",newNote});
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Intrnal Server Error.."});
    }
}

export const createAssignment = async(request,response,next)=>{
    try{
         let {title,description,dueDate,subject,createdBy} = request.body;

         let newAssignment = await Assignment.create({title,description,dueDate,subject,createdBy});
         return response.status(200).json({Message:"Assignment Created Successfully..",newAssignment});
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internal Server Error.."});
    }
}

export const postAnnouncement = async(request,response,next)=>{
    try{
        let {title,message,postedBy} = request.body;
        let newAnnouncement = await Announcement.create({title,message,postedBy});
        return response.status(200).json({message:"Post Announcement..",newAnnouncement});
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internal Server Error.."});
    }
}