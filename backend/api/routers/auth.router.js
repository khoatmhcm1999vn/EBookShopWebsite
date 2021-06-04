"use strict";
import express from "express";
import authController from "../controllers/auth.controller.js";
import { verifyToken, verifyRefreshToken } from "../middleware/index.js";
const { Register, Login, Logout, GetAccessToken } = authController;

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/token", verifyRefreshToken, GetAccessToken);
authRouter.get("/logout", verifyToken, Logout);

export default authRouter;
