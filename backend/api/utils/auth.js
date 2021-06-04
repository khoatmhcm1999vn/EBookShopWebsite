"use strict";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res) => {
  if (
    typeof req.body.token === "undefined" ||
    typeof req.body.user_name === "undefined"
  ) {
    return res
      .status(422)
      .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
  }
  let token = req.body.token;
  let user_name = req.body.user_name;
  try {
    let decoded = await jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET ||
        "9e2fbe2f30f3bee85171dd00f4ff10d6745b120387a6bbcc16e5b5dd3524b8cdcae69586bf183b01b3c88215a4eb339e99ae9d98aab83b44872e972bae355ec4"
    );
    if (decoded.user_name == user_name) {
      return res
        .status(200)
        .json({ success: true, message: "👍 Xác thực token thành công!" });
    }
    // res;
  } catch (err) {
    return res
      .status(404)
      .json({ success: false, message: "👎 Xác thực token thất bại!" });
  }
  return res
    .status(404)
    .json({ success: false, message: "👎 Xác thực token thất bại!" });
};
