"use strict";
import express from "express";
import {
  register,
  verifyAccount,
  requestForgotPassword,
  verifyForgotPassword,
  forgotPassword,
  updateInfor,
  updatePassword,
} from "../controllers/user.controller.js";
import { login } from "../controllers/admin.controller.js";
import { verifyToken } from "../utils/auth.js";
import { recaptchaGoogleCheck } from "../middleware/index.js";

const userRouter = express.Router();

userRouter.post("/user/register", recaptchaGoogleCheck, register);
userRouter.get("/user/verify/:token", verifyAccount);
userRouter.post("/user/login", login);

userRouter.get("/user/request/forgotpassword/:email", requestForgotPassword);
userRouter.post("/user/verify/forgotpassword", verifyForgotPassword);
userRouter.post("/user/forgotpassword", forgotPassword);

userRouter.post("/auth", verifyToken);
userRouter.post("/user/updateinfor", updateInfor);
userRouter.post("/user/updatepassword", updatePassword);

export default userRouter;
