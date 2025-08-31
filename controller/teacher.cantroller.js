import { Announcement } from "../model/announcement.model.js";
import { Assignment } from "../model/assignment.model.js";
import { Note } from "../model/note.model.js";
import { Doubt } from "../model/doubt.model.js";
import { request } from "http";


export const deleteAnnouncement = async(request,response,next)=>{
  try{
      // let {id} = request.params;
      let announceDelete = await Announcement.findByIdAndDelete(request.params.id);

      return response.status(200).json({message:"Announcement Deleted Successfully"});
  }catch(err){
    return response.status(500).json({errorMessage:"Internal Server Error"});
  }
}

export const doubtResponse = async (request,response,next)=>{
 try{
    const doubtId = request.params.doubtId;
    const {answerText,answerBy} = request.body;
    const submitDoubt = await Doubt.findById(doubtId);

    if(!submitDoubt){
      return response.status(401).json({message:"Doubt not found"});
    }

    submitDoubt.answers.push({ answerText,answerBy, answeredAt: new Date() });
    
    submitDoubt.save();

    return response.status(200).json({message:"Doubt Response Successfully"})

 }catch(err){
  console.log(err);
  return response.status(500).json({errorMessage:"Internal Server Error"});
 }
}

export const getAssignmentSubmissionStats = async (request, response) => {
  try {
    const teacherId = request.user._id || request.user.id;

    const assignments = await Assignment.find({ createdBy: teacherId })
      .populate("submissions.student", "name email");

    const stats = assignments.map(assign => ({
      assignmentId: assign._id,
      title: assign.title,
      duedate: assign.dueDate,
      subject: assign.subject,
      totalStudentsSubmitted: assign.submissions.filter(
        sub => sub.status === "Submitted"
      ).length,
      totalSubmissions: assign.submissions.length,
      submissions: assign.submissions.map(sub => ({
        studentName: sub.student?.name || "Unknown",
        studentEmail: sub.student?.email || "Unknown",
        fileUrl: sub.fileUrl,
        submittedAt: sub.submittedAt,
        status: sub.status
      }))
    }));

    response.status(200).json({ success: true, stats });
  } catch (err) {
    console.error(err);
    response.status(500).json({ errorMessage: "Internal server error" });
  }
};

export const getAllDoubts = async (request, response,next) => {
    try {
        const doubts = await Doubt.find().populate("askedBy", "name email profile.imageName").sort({ createdAt: -1 });
        console.log(doubts);
        if (!doubts || doubts.length === 0) {
            return response.status(404).json({success: false,message: "Doubts not found"});s
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
       const {title,subject,description} = request.body;

       if(!request.file){
        return response.status(400).json({message:"File is requried"});
       }

       const fileUrl = `http://localhost:3000/uploadNotes/${request.file.filename}`
       const uploadedBy = request.user._id || request.user.id;
       const uploadedAt = new Date();

       const newNote = await Note.create({title,subject,description,fileUrl,uploadedBy,uploadedAt});

        const formattedNote = {...newNote.toObject(),
        uploadedAt: uploadedAt.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    };

       return response.status(200).json({message:"Note Uploaded Successfully..",newNote:formattedNote});
    }catch(err){
        console.log(err);
        return response.status(500).json({errorMessage:"Intrnal Server Error.."});
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
        const uploadedAt = new Date();

        let newAnnouncement = await Announcement.create({title,message,postedBy,uploadedAt});
        const formattedAnnouncement = {...newAnnouncement.toObject(),
        uploadedAt: uploadedAt.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    };

        return response.status(200).json({message:"Post Announcement..",newAnnouncement:formattedAnnouncement});
    }catch(err){
        console.log(err);
        return response.status(500).json({errorMessage:"Internal Server Error.."});
    }
}