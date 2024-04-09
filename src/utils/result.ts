import { Response } from "express";
import Iuser from "../types/type";

class Result{
    message:string | null 
    data:Iuser | null 
    
    constructor(data:Iuser | null=null , message:string | null = null){
        this.message = message;
        this.data = data;
    }

    success(res:Response){
        return res.status(200).json({
            success: true,
            data: this.data,
            message: this.message ?? "işlem başarılı."
        })
    }

    created(res:Response){
        return res.status(200).json({
            success:true,
            data: this.data,
            message: this.message ?? "işlem başarılı"
        })
    }

    err500(res:Response){
        res.status(500).json({
            success:false,
            data: this.data,
            message: this.message ?? "işlem başarısız"
        })
    }

    err400(res:Response){
        res.status(400).json({
            success:false,
            data: this.data,
            message:this.message ?? "işlem başarısız"
        })
    }

    err401(res:Response){
        res.status(401).json({
            success: false,
            data: this.data,
            message: this.message ?? "işlem başarısız"
        })
    }

    err402(res:Response){
        res.status(402).json({
            success:false,
            data: this.data,
            message: this.message ?? "işlem başarısız"
        })
    }

    err403(res:Response){
        res.status(403).json({
            success:false,
            data:this.data,
            message:this.message ?? "işlem başarısız"
        })
    }

    err429(res:Response){
        res.status(429).json({
            success:false,
            data: this.data,
            message: this.message ?? "işlem başarısız"
        })
    }
}

export default Result