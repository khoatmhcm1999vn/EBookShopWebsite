import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: "Darktimedog456*",
    },
    tls: { rejectUnauthorized: false },
  })
);
export const sendEmail = async (email, token) => {
  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Account Verification Token",
    text: "Hello my friend",
    html:
      "<b>Verify your account</b>" +
      " <br/>" +
      "<span>Please verify your account by clicking the link</span>" +
      "<br/>" +
      "<span>http://localhost:3000/confirm/" +
      token +
      "</span>",
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
export const sendEmailForgotPassword = async (email, token) => {
  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Forgot password Verification Token",
    html:
      "<b>Forgot password</b>" +
      " <br/>" +
      "<span>Please enter OTP below</span>" +
      "<br/>" +
      "<span>" +
      token +
      "</span>",
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
export const sendMailConfirmPayment = async (email, token) => {
  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Payment Verification Token",
    text: "Hello my friend",
    html:
      "<b>Verify your account</b>" +
      " <br/>" +
      "<span>Please verify your account by clicking the link</span>" +
      "<br/>" +
      "<span>http://localhost:3000/payment/" +
      token +
      "</span>",
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
