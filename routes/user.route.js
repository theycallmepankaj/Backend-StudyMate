import express from "express";
import { authenticate, createProfile, createUser, fatchUser, getProfile, logOut } from "../controller/user.controller.js";
import { body } from "express-validator";
import multer from "multer";
import { auth } from "../middleware/auth.js";
const upload = multer({dest:"public/profile"})
const router = express.Router();

router.post("/",
    body("name","Name is required").notEmpty(),
    body("email","Email is requried").notEmpty(),
    body("email","Not a valid Emal").isEmail(),
    body("password","password is requrid").notEmpty(),
    body("role","Role is requried").notEmpty()
    ,createUser);

router.post("/authenticate",authenticate);
router.get("/",fatchUser);
router.delete("/logout",auth,logOut);
router.get("/profile/:id",getProfile);
router.patch("/profile/:userId",upload.single("imageName"),createProfile);
export default router;