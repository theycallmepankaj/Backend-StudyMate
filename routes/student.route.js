import express from "express";
import { askQuestion, deleteDoubt, getAllDoubts, getAllNotes, getAnnouncement, getStudentAssignment, getStudentDashboard, getStudentFiles, getStudentProfile, submitAssignment } from "../controller/student.controller.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

const storage =multer.diskStorage({ 
    destination: function(request,file,cb){
        cb(null,"uploads/");
    },
    filename: function(request,file,cb){
        const uniqueName = Date.now()+"-"+ file.originalname;
        cb(null,uniqueName);
    }
});
const upload = multer({storage});

router.delete("/:id",auth,deleteDoubt);
router.get("/announcements",getAnnouncement)
router.get("/profile",auth,getStudentProfile);
router.get("/doubts",auth,getAllDoubts);
router.get("/files",auth,getStudentFiles);
router.get("/assignments",auth,getStudentAssignment);
router.get("/dashboard",auth,getStudentDashboard);
router.get("/getallnote",auth,getAllNotes);
router.post("/:assignmentId/submit",auth,upload.single("file"),submitAssignment);
router.post("/doubts",auth,askQuestion);

export default router;