import { request, response } from "express";
import { Assignment } from "../model/assignment.model.js";
import { Doubt } from "../model/doubt.model.js";
import { Note } from "../model/note.model.js";
import { File } from "../model/file.model.js";
import { User } from "../model/user.model.js";

export const getStudentProfile = async(request,response,next)=>{
    try{
      const studentId = request.user.id;
      console.log(studentId);
       
      const studentProfile = await User.findById(studentId).select("-password");
      if(!studentProfile){
       return response.status(404).json({Message:"Profile not found"});
      }

      return response.status(200).json(studentProfile);
    }catch(err){
      console.log(err);
      return response.status(500).json({ErrorMessage:"Internal Server Error"});
    }
}

export const getAllDoubts = async(request,response,next)=>{ 
    try{
        console.log("req user >> ",request.user);
        const doubts = await Doubt.find({ askedBy: request.user.id }).populate("askedBy","name");
         console.log(doubts);
        if(!doubts){
            return response.status(404).json({Message:"Doubts not found"});
        }
        return response.status(200).json({"All Doubts":doubts});
    }catch(err){
      console.log(err);
      return response.status(500).json({ErrorMessage:"Internal server Error..."});
    }
}

export const getStudentFiles = async(request,response,next)=>{
    try{
      const files = await File.find();
      if(!files){
        return response.status(404).json({message:"file not found"});
      }
      return response.status(200).json(files)
    }catch(err){
      console.log(err);
      return response.status(500).json({ErrorMessage:"Internal server Error"});
    }
}

export const getStudentAssignment = async(request,response,next)=>{
    try{
       const assignments = await Assignment.find();

       if(!assignments){
        return response.status(401).json({Message:"Assignment not found"});
       }

       return response.status(200).json(assignments);
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internal server Error"});
    }
}

export const getStudentDashboard = async(request,response,next)=>{
    try{
    const studentId = request.user.id;

    const assignments = await Assignment.find({"submissions.student":studentId});
    const notes = await Note.find();
    const doubts = await Doubt.find({ askedBy: studentId});

    return response.status(200).json({success: true, message:"Dashboard loaded",data:{assignments,notes,doubts}});
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internal Server Error"});
    }
}

export const getAllNotes = async(request, response, next)=>{
    try{
       const notes = await Note.find().populate("uploadedBy","name");
       return response.status(200).json({message:"All notes",notes});
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internal Server Error.."});
    }
}

export const submitAssignment = async(request, response, next)=>{
    try{
        const {fileUrl} = request.body;
        const StudentId = request.user.id;
        const assignmentId = request.params.assignmentId;

        const assignment = await Assignment.findById(assignmentId);
        console.log("assignment :- ",assignment); 
        if(!assignment){
            return response.status(401).json({ErrorMessage:"Asssignment not found.."});
        }
         
         if (!assignment.submissions) {
         assignment.submissions = [];
        }

        assignment.submissions.push({student:StudentId,fileUrl,submittedAt: new Date()});

        assignment.save();

        return response.status(200).json({Message:"Assignment Submitted Successfully..."});
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internal Server Error.."});
    }
}

export const askQuestion = async (request,response,next)=>{
    try{
       const {question, subject,description} = request.body;
        const askedBy = request.user.id;

       const newDoubt =await Doubt.create({question, subject,description,askedBy});

       return response.status(201).json({message:"Doubt Submitted...",newDoubt});
    }catch(err){
        console.log(err);
       return response.status(500).json({Message:"Internal Server Error..."});
    }
}