import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.MAIL_KEY,
  },
});

transporter.verify((error) => {
   if (error) {
    console.error("Error configuring mailer:", error);
  } else {
    console.log("Mailer is ready to send emails.");
  }
});

export default transporter;
