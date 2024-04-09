import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import APIError from "../utils/errors";
import Iuser from "../types/type";
import { createToken, createTemporaryToken, decodedTempraryToken } from "../middlewares/auth";
import Result from "../utils/result";
import crypto from "crypto";
import sendEmail from "../utils/sendMail";
import moment from "moment";

export const register = async (req: Request, res: Response): Promise<any> => {
  const userCheck = await User.findOne({ email: req.body.email });

  if (userCheck) {
    throw new APIError("email zaten kayıtlı", 401);
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);
  const user = new User(req.body);
  await user
    .save()
    .then((data: Iuser) => {
      createToken(data, res);
      return new Result(data, null);
    })
    .catch((err: any) => {
      throw new APIError("hata aldınız", 401);
    });
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body as Pick<Iuser, "email" | "password">;
  const user: Iuser | null = await User.findOne({ email });

  if (!user) {
    throw new APIError("email veya parola hatalı", 401);
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new APIError("email veya parola hatalı", 401);
  }

  createToken(user, res);
};

export const me = async (req: any, res: Response) => {
  return new Result(req.user).success(res);
};

export const forgetPassword = async (req: Request, res: Response) => {
  const {email} = req.body;

  const userInfo = await User.findOne({email}).select("email");

  if(!userInfo) {
      throw new APIError("Geçersiz Kullanıcı", 400);
  }

  const resetCode = crypto.randomBytes(3).toString("hex");

    await sendEmail({
          from: process.env.ORIGINAL_EMAIL_USER,
          to: userInfo.email,
          subject: "Şifre Sıfırlama",
          text: `Şifre Sıfırlama Kodunuz ${resetCode}`
     })


      userInfo.reset = {
          code: resetCode,
          time: moment(new Date()).add(15, "minute").format("YYYY-MM-DD HH:mm:ss")
      };
      await userInfo.save();


  return new Result(userInfo,"Lütfen Mail Kutunuzu Kontrol Ediniz").success(res);
}


export const resetCodeCheck = async(req:Request,res:Response)=>{
  const {email, code} = req.body

  const userInfo = await User.findOne({email}).select("_id name email reset")

  if(!userInfo) throw new APIError("geçersiz kod", 401)

    const dbTime = moment(userInfo.reset.time)
    const nowTime = moment(new Date())

    const timeDiff = dbTime.diff(nowTime, "minutes")

    if(timeDiff <= 0 || userInfo.reset.code === code){
      throw new APIError("Gecersiz kod", 401)
    }

    const temporaryToken = await createTemporaryToken(userInfo._id, userInfo.email)
}


export const resetPassword =async (req:Request, res:Response)=>{
  const {password, temporyToken} = req.body;

  const decodedToken:any = await decodedTempraryToken(temporyToken)

  const hashPassword = await bcrypt.hash(password, 10)

  await User.findByIdAndUpdate(
      {_id: decodedToken._id},
      {
          reset:{
              code:null,
              time:null
      },
          password:hashPassword
      }
  )

  return new Result(decodedToken,"şifre sıfırlama başarılı").success(res)
}