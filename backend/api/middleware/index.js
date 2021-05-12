"use strict";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const requireSignin = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    // const token = authHeader.split(" ")[1];
    let decodeToken;
    try {
      decodeToken = await jwt.verify(authHeader, process.env.JWT_SECRET);
    } catch (err) {
      return next();
    }
    req.user = decodeToken;
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Authorization required" });
  }
  next();
};
export const adminMiddleware = (req, res, next) => {
  if (!req.user.is_admin) {
    return res
      .status(400)
      .json({ success: false, message: "Admin access denied" });
  }
  next();
};
