import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Iuser from "../types/type";
import APIError from "../utils/errors";
import User from "../models/user";
import { string } from "joi";

export const createToken = (user: Iuser, res: Response) => {
    const payload:object = {
        sub: user._id,
        name: user.name
    }

    const token:string = jwt.sign(payload ,process.env.SECRET_KEY || "" ,{
        expiresIn:"1h",
        algorithm: "HS512"
    })

    return res.status(200).json({
        success:true,
        token,
        message:"işlem başarılı"
    })
}


export const checkToken = async (req:Request | any, res:Response, next:NextFunction)=>{
    const headerToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer ");

    if(!headerToken){
        throw new APIError("Lütfen  oturum açınız", 401)
    }

    const token : string  = req.headers.authorization.split(" ")[1]

    jwt.verify(token, process.env.SECRET_KEY || "" ,async (err:any, decoded:any)=>{
        if(err){
            throw new APIError("geçersiz token",401)
        }

        const  userInfo:Iuser = await User.findById(decoded.sub).select("_id name email");

        if(!userInfo){
            throw new APIError("Geçersiz token",401)
        }
        req.user = userInfo as Pick<Iuser, "_id" | "name"  | "email">;
        next()
    })

}


export const createTemporaryToken = async (userId:number | string, email:string | number)=>{
    const payload:object = {
        sub:userId,
        email
    }

    const token =  jwt.sign(payload, process.env.SECRET_TEMPORARY_KEY || "", {
        expiresIn:"3m",
        algorithm: "HS512"
    })

    return token;

}   


export const decodedTempraryToken = async(temproryToken:any)=>{
    const token:string = temproryToken.split(" ")[1]
    let userInfo
     jwt.verify(token, process.env.SECRET_TEMPORARY_KEY || "" , async(err:any, decoded:any)=>{
        if(err){
            throw new APIError("token geçersiz", 400)
        }
        userInfo = await User.findById(decoded.sub)
        if(!userInfo){
            throw new APIError("geçersiz token",401)
        }
    })
    return(token)
}