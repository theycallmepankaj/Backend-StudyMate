import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = async (request,response,next)=>{
    try{
        let {token} = request.cookies;

        if(!token){
            return response.status(401).json({Message:"Unauthorized User..."});
        }
        let decoded = jwt.verify(token,process.env.SECRET_KEY);
        request.user = {...decoded,id: decoded._id || decoded.id,};
        next();
    }catch(err){
        console.log(err);
        return response.status(500).json({ErrorMessage:"Internal Server Errer.."});
    }
}