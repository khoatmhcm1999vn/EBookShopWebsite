"use strict";
import express from "express";
import {
  register,
  verifyAccount,
  resendLink,
  requestForgotPassword,
  verifyForgotPassword,
  forgotPassword,
  updateInfor,
  updatePassword,
} from "../controllers/user.controller.js";
import {
  login,
  getAccessToken,
  logOut,
} from "../controllers/admin.controller.js";
// import { verifyToken } from "../utils/auth.js";
import { verifyToken, verifyRefreshToken } from "../middleware/index.js";
import { recaptchaGoogleCheck } from "../middleware/index.js";

const userRouter = express.Router();

userRouter.post("/user/register", recaptchaGoogleCheck, register);
userRouter.get("/user/verify/:token", verifyAccount);
userRouter.post("/user/resend", resendLink);
userRouter.post("/user/login", login);
userRouter.post("/user/token", verifyRefreshToken, getAccessToken);
userRouter.get("/user/logout", verifyToken, logOut);

userRouter.get("/user/request/forgotpassword/:email", requestForgotPassword);
userRouter.post("/user/verify/forgotpassword", verifyForgotPassword);
userRouter.post("/user/forgotpassword", forgotPassword);

userRouter.post("/auth", verifyToken);
userRouter.post("/user/updateinfor", updateInfor);
userRouter.post("/user/updatepassword", updatePassword);
userRouter.get("/dashboard", verifyToken, (req, res) => {
  // console.log(Date.now());
  // console.log(Date.now() + 3600000);
  return res.json({ status: true, message: "Hello from dashboard." });
});

export default userRouter;
