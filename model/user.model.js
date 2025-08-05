import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
         trim: true
    },
    email:{
        type:String,
        unique:true
    },
    password:String,
    role:{
        type:String,
        enum:['student','teacher']
    },
    profile:{
        imageName:{
        type:String,
        default:"a771c3d7ad0650959a7da7acee4e8fe4"
        },
        contact:{
            type:String,
            isNumeric: true
        },
        address:String,
        bio:String 
    }
});

export const User = mongoose.model("User",userSchema);