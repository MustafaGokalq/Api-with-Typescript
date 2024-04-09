import rateLimit from "express-rate-limit";
import {Request, Response} from "express";

const allowList = ["::1"];

const apiLimiter = rateLimit({
    windowMs: 60*1000*15,
    max:(req:Request,res:Response):number=>{
        if(req.url === "/auth/login" || req.url === "/auth/register") return 5
            else return 100
    },
    message: {
        success:false,
        message:"Çok fazla istekte bulundunuz."
    },
    skip: (req: any, res: Response) => allowList.includes(req.ip),
    standardHeaders: true,
    legacyHeaders: false
})

export default apiLimiter;