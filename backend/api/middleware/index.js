"use strict";
import jwt from "jsonwebtoken";
import redis_client from "../../../redis_connect.js";
import dotenv from "dotenv";
import request from "request";
dotenv.config();

export const requireSignin = async (req, res, next) => {
  // const authHeader = req.get("Authorization");
  const authHeader = req.headers.authorization.split(" ")[1];
  if (authHeader) {
    // const token = authHeader.split(" ")[1];
    let decodeToken;
    try {
      decodeToken = jwt.verify(authHeader, process.env.JWT_ACCESS_SECRET);
      req.user = decodeToken;
      return next();
    } catch (err) {
      // return next();
      return res.status(401).json({
        status: false,
        message: "Your session is not valid.",
        data: err,
      });
    }
    // req.user = decodeToken;
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Authorization required" });
  }
  // next();
};
export const adminMiddleware = (req, res, next) => {
  if (!req.user.is_admin) {
    return res
      .status(400)
      .json({ success: false, message: "Admin access denied" });
  }
  next();
};

export const recaptchaGoogleCheck = (req, res, next) => {
  const { captchaValue } = req.body;
  if (
    captchaValue === undefined ||
    captchaValue === "" ||
    captchaValue === null
  ) {
    return res
      .status(401)
      .json({ result: "error", message: "👎 Please select captcha" });
  }

  const secretKey = process.env.GOOGLE_RECAPCHA_KEY;
  let check = true;
  const verificationURL =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    secretKey +
    "&response=" +
    captchaValue +
    "&remoteip=" +
    req.connection.remoteAddress;

  try {
    request(verificationURL, function (error, response, body) {
      body = JSON.parse(body);
      // console.log(body);
      if (body.success !== undefined && !body.success) {
        check = false;
        // return res.json({
        //   result: "error",
        //   message: "👎 Failed captcha verification",
        // });
      }
      if (check) {
        // console.log("check captcha");
        next();
      } else
        return res.status(401).json({
          result: "error",
          message: "👎 Failed captcha verification",
        });
    });
  } catch (err) {
    console.error(err);
  }
};

export function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Your session is not valid.",
      data: error,
    });
  }
}
export function verifyRefreshToken(req, res, next) {
  const refresh_token = req.query.refresh_token;
  // console.log(refresh_token);

  if (refresh_token === null)
    return res.status(401).json({
      status: false,
      message: "Invalid request.",
    });
  try {
    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET ||
        "901fa0c0364e907c1a857621f4c884f4cbe2f2ab6c1b770822a2d82a573d74cf1ff9777067b52e471920d098a0bc8e4f53917a89cf42f6bc98364a3df8539d34"
    );
    req.userData = decoded;

    redis_client.get(decoded._id.toString(), (err, data) => {
      if (err) throw err;
      if (data === null)
        return res.status(401).json({
          status: false,
          message: "Invalid request. Token is not in store.",
        });
      if (JSON.parse(data).token != refresh_token)
        return res.status(401).json({
          status: false,
          message: "Invalid request. Token is not same in store.",
        });
      next();
    });
  } catch (error) {
    return res.status(401).json({
      status: true,
      message: "Your session is not valid.",
      data: error,
    });
  }
}
