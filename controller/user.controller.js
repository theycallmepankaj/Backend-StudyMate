import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const fatchUser = async(request,response,next)=>{
    try{
        let findUser = await User.find();
        return response.status(200).json({Message:"User Fatches Successfully",findUser});
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internl server Error"});                    
    }
}

export const getProfile = async(request,response,next)=>{
    try{
        let userId = request.params.id;

        if(!userId){
            return response.status(401).json({message:"user not found"});
        }
        let user = await User.findById(userId);
        return response.status(201).json({message:"user found",user});
    }catch(err){
        console.log(err);
        return response.status(500).json({message:"Internal server error"});
    }
}

export const createProfile = async (request, response, next) => {
    try {
        console.log("Uploaded file: ", request.file);
        const user = await User.findById(request.params.userId);

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        // Ensure user.profile exists
        if (!user.profile) {
            user.profile = {};
        }

        // ✅ Only assign image if file exists
        if (request.file && request.file.filename) {
            user.profile.imageName = request.file.filename;
        }

        // ✅ Update profile safely
        user.profile.address = request.body.address || user.profile.address;
        user.profile.contact = request.body.contact || user.profile.contact;
        user.profile.bio = request.body.bio || user.profile.bio;

        // ✅ Update base fields safely
        user.name = request.body.name ?? user.name;
        user.email = request.body.email ?? user.email;

        await user.save();

        return response.status(201).json({ message: "Profile Uploaded", user });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ errorMessage: "Internal Server Error" });
    }
};

export const logOut = async (request,response,next)=>{
    try{
     response.clearCookie("token");
      return response.status(201).json({Message:"logout success!"});
    }catch(err){
        console.log(err);
        return response.status(500).json({Message:"Internal Server Error..."});
    }
}

export const createUser = async (request,response,next)=>{
    try{
    let {name,email,password,role} = request.body;

    let errors = validationResult(request);

    if(!errors.isEmpty()){
         return response.status(401).json({message:"Bad Request | Unauthorized User",message : errors.array()});
    }
     let saltKey =  bcrypt.genSaltSync(12);
     password = bcrypt.hashSync(password,saltKey);
     let user = await User.create({name,email,password,role});
     return response.status(200).json({message:"User Registerd Successfully",user});
    }catch(err){
        console.log(err);
        return response.status(500).json({Message:"Internal Server Error"});
    }
}

export const authenticate = async (request,response,next)=>{
    try{
        let {email,password} = request.body;
        const user = await User.findOne({email});
            if(user){
        response.cookie("token",genrateToken(user._id,user.email),{ 
             httpOnly: true,
             secure: false, 
             sameSite: "lax"
        });
        let status = bcrypt.compareSync(password,user.password);
        console.log("status :- ",user);
        return status ? response.status(200).json({message:"Sign in Successfull..",user:user}) : response.status(401).json({message:"Bad request : Unauthorized User "});
            }
        return response.status(401).json({errorMessage:"Bad request : Unauthorized User "});
    }catch(err){
        console.log(err); 
        return response.status(500).json({errorMessage:"Internal Servre Error"});
    }
}


export const genrateToken = (id,email)=>{
   let payload = {id,email};
   let token = jwt.sign(payload,process.env.SECRET_KEY);
   console.log("token :- ",token);
   return token;

}


