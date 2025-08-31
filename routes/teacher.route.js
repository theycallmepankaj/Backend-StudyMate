import express from "express";
import path, { dirname } from "path"
import { createAssignment, deleteAnnouncement, doubtResponse, getAllDoubts, getAssignmentSubmissionStats, getTeacherDashboard, postAnnouncement, uploadNote } from "../controller/teacher.cantroller.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { Note } from "../model/note.model.js";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadNotes/'); // uploads/notes folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({storage});

router.delete("/:id",auth,deleteAnnouncement);
router.post("/doubtResponse/:doubtId",auth,doubtResponse);
router.get("/submissions-stats", auth, getAssignmentSubmissionStats);
router.get("/doubts", auth, getAllDoubts);
router.get("/dashboard",auth,getTeacherDashboard);
router.post("/notes",auth,upload.single("fileUrl"),uploadNote);
router.post("/assignments",auth,createAssignment);
router.post("/announcements",auth,postAnnouncement);

router.get("/download/:filename", auth, (request, response) => {
    const filename = request.params.filename;
    const filePath = path.join(__dirname, "../uploadNotes", filename);

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("Download error:", err);
            response.status(404).send("File not found");
        }
    });
});
export default router;