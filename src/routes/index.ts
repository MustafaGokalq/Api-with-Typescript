import express,{Request, Response, Router}  from "express"
import authRouter from "./auth.routes"
import APIError from "../utils/errors";
import multer from "multer";
import upload from "../middlewares/lib/upload";
import Result from "../utils/result";


const router : Router = express.Router();

router.use("/auth",authRouter);


router.post("/upload", function (req: any, res: any) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) 
            throw new APIError("Resim Yüklenirken Multer Kaynaklı Hata Çıktı : ", 200);
        else if (err) {
             throw new APIError("Resim Yüklenirken Hata Çıktı : ", err)
        }
           
        else return new Result(req.savedImages,"Yükleme Başarılı").success(res);
    });
})


export default router;

