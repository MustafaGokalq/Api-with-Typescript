
const whiteList=["http://localhost:3000"]

export const corsOptions = (req:any, callback: Function) =>{
    let corsOptions;
    if(whiteList.indexOf(req.header("Origin")) !== -1){
        corsOptions = {origin:true}
    }else{
        corsOptions = {origin:false}
    }

    callback(null, corsOptions)
}
