import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = async (request,response,next)=>{
    try{
        let {token} = request.cookies;

        if(!token){
            return response.status(401).json({Message:"Unauthorized User..."});
        }
        let decode = jwt.verify(token,process.env.SECRET_KEY);
        request.user = decode;
        next();
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internal Server Errer.."});
    }
}