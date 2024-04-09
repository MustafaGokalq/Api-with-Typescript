import { NextFunction, Request, Response } from "express";
import APIError from "../../utils/errors";
import joi from "joi"

export default class AuthValidation{
    constructor(){}


    static register = async (req:Request, res:Response, next:NextFunction)=>{
        try {
            await joi.object({
                name: joi.string().required().max(32).messages({
                    "string.base":"name normal karakterlerden oluşmalıdır.",
                    "string.empty":"name boş geçilemez",
                    "string.max":"name en fazla 32 karakter olabilir.",
                    "string.required":"name alanı zorunludur."
                }),
                email: joi.string().email().required().max(32).messages({
                    "string.base":"email alanı normal karakterlerden oluşmalıdır.",
                    "string.empty":"email alanı boş geçilemez",
                    "string.max":"email alanı en fazla 32 karakterden oluşmalıdır",
                    "string.required":"email alanı zorunludur.",
                    "string.email":"email alanı email formatında olmalıdır."
                }),
                password:joi.string().min(5).max(16).required().messages({
                    "string.base":"parola alanı normal karakterlerden oluşmalıdır.",
                    "string.empty":"parola alanı boş geçilemez",
                    "string.min":"parola alanı en az 5 karakterden oluşmalıdır",
                    "string.max":"parola alanı en fazla 16 karakterden oluşmalıdır",
                    "string.required":"parola kısmı zorunludur."
                })
            }).validateAsync(req.body)
        } catch (error:any) {
            if(error.details && error.message[0].message){
                throw new APIError(error.message[0].message, 400)
            }else{
                throw new APIError("Validasyon hatası",400)
            }
        }
        next()
    }

    static login = async(req:Request, res:Response, next:NextFunction)=>{
        try {
            await joi.object({
                email: joi.string().email().required().max(32).messages({
                    "string.base":"email normal karakterlerden oluşmalıdır.",
                    "string.empty":"email alanı boş geçilemez",
                    "string.email":"email alanı email formatında olmalıdır.",
                    "string.required":"email alanı zorunludur.",
                    "string.max(32)":"email en fazla 32 karakterden oluşmalıdır"
                }),
                password: joi.string().min(5).max(32).required().messages({
                    "string.base":"parola normal karakterlerden oluşmalıdır",
                    "string.empty":"paroal alanı boş geçilemez",
                    "string.required":"parola alanı zorunludur.",
                    "string.min(5)":"parola alanı en az 5 karakterden oluşmalıdır",
                    "string.max(32)":"parola alanı en fazla 32 karakterden oluşmalıdır."
                })
            }).validateAsync(req.body)
        } catch (error:any) {
            if(error.details && error.message[0].message){
                throw new APIError(error.details[0].message, 400)
            }
            else{
                throw new APIError("validasyon hatası",400)
            }
            
        }
        next()
    }
}