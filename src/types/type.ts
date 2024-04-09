import Document  from "mongoose"


interface Iuser extends Document{
    _id:string,
    name:string,
    email:string,
    password:string,
    reset:{
        code:string,
        time:string
    }
}

export default Iuser;