"use strict";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import request from "request";
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

export const recaptchaGoogleCheck = (req, res, next) => {
  const { captchaValue } = req.body;

  if (
    captchaValue === undefined ||
    captchaValue === "" ||
    captchaValue === null
  ) {
    return res.json({ result: "error", message: "👎 Please select captcha" });
  }

  const secretKey = process.env.GOOGLE_RECAPCHA_KEY;
  let check = false;
  const verificationURL =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    secretKey +
    "&response=" +
    captchaValue +
    "&remoteip=" +
    req.connection.remoteAddress;

  const init = async () => {
    try {
      const result = await request(
        verificationURL,
        function (error, response, body) {
          body = JSON.parse(body);
          // console.log(body);
          if (body.success !== undefined && !body.success) {
            check = false;
            // return res.json({
            //   result: "error",
            //   message: "👎 Failed captcha verification",
            // });
          }
          // return res.json({ result: "success", message: "👍 Thành công!" });
          // return;
          check = true;

          if (check) {
            // console.log("check captcha");
            next();
          } else
            return res.json({
              result: "error",
              message: "👎 Failed captcha verification",
            });
        }
      );
      // console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  init();
};
