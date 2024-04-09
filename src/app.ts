import "express-async-errors"
import express,{ Express } from "express";
import db from "./db/db";
import dotenv from "dotenv"
dotenv.config()
import router from "./routes"
import errorHandlerMiddleware from "./middlewares/errorHandler";
const app:Express = express();
import cors from "cors"
import { corsOptions } from "./helpers/corsOptions";
import ExpressMongoSanitize = require("express-mongo-sanitize");
import path = require("path");
import apiLimiter from "./middlewares/rateLimit";
import moment = require("moment-timezone");
moment.tz.setDefault("Europe/Istanbul");

//middleware
app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit:'50m', extended:true, parameterLimit:50000}))
app.use(express.static(path.join(__dirname,"public")))
app.use("/uploads", express.static(__dirname))
app.use(cors(corsOptions))
app.use("/api", apiLimiter); 
app.use(
    ExpressMongoSanitize({
      replaceWith: '_',
    }),
  );

//router
app.use("/api", router)
app.use(errorHandlerMiddleware)

app.listen(process.env.PORT ,():void=>{
    db()
    console.log("running to running 3000")
})