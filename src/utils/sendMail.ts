import nodemailer from "nodemailer"
import APIError from "./errors"

const sendEmail = async (mailOptions:any) => {
  const transporter =  nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
      }
  })

   transporter.sendMail(mailOptions, (error, _info) => {
      if (error) {
          console.log("Hata Çıktı Mail Gönderilemedi : ", error);
          throw new APIError("Mail Gönderilemedi !", 400);
      }
      // console.log("info : ",info);
      return true
  })
}



export default sendEmail