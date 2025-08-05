import express from "express";
import { askQuestion, getAllDoubts, getAllNotes, getStudentAssignment, getStudentDashboard, getStudentFiles, getStudentProfile, submitAssignment } from "../controller/student.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile",auth,getStudentProfile);
router.get("/doubts",auth,getAllDoubts);
router.get("/files",auth,getStudentFiles);
router.get("/assignments",getStudentAssignment);
router.get("/dashboard",auth,getStudentDashboard);
router.get("/getallnote",auth,getAllNotes);
router.post("/:assignmentId/submit",auth,submitAssignment);
router.post("/doubts",auth,askQuestion);

export default router;