import mongoose, { Schema } from "mongoose";
import Iuser from "../types/type"

const userSchema:Schema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    reset:{
        code:{
            type:String,
            default:null

        },
        time:{
            type:String,
            default:null
        }
    }
})

export default mongoose.model<Iuser>("User", userSchema)