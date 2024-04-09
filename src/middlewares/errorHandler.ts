import { Request, Response, NextFunction } from "express";
import APIError from "../utils/errors";


const errorHandlerMiddleware = (err:Error,req:Request, res:Response, next:NextFunction)=>{
    if(err instanceof APIError){
        return res.status(err.statusCode || 400).json({
            success:false,
            message: err.message
        })
    }

    next()

    return res.status(500).json({
        success:false,
        message: "bir hata ile karşılaşıldı lürfen api'nizi kontrol ediniz"
    })
}

export default errorHandlerMiddleware;