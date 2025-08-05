import express from "express";
import { createAssignment, getAllDoubts, getTeacherDashboard, postAnnouncement, uploadNote } from "../controller/teacher.cantroller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/doubts", auth, getAllDoubts);
router.get("/dashboard",auth,getTeacherDashboard);
router.post("/notes",uploadNote);
router.post("/assignments",auth,createAssignment);
router.post("/announcements",auth,postAnnouncement);
export default router;