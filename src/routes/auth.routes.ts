import express,{Router} from "express";
import { forgetPassword, login, me, register, resetCodeCheck, resetPassword } from "../controllers/auth.controller";
import AuthValidation from "../middlewares/validations/auth.validation";
import { checkToken } from "../middlewares/auth";

const router:Router = express.Router()

router.post("/register",AuthValidation.register,register)

router.post("/login",AuthValidation.login,login)

router.get("/me",checkToken , me)        

router.post("/forgetPassword", forgetPassword)

router.post("/resetCodeCheck",resetCodeCheck)

router.post("/resetPassword",resetPassword)

export default router