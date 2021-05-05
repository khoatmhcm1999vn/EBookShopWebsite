"use strict";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res) => {
  if (
    typeof req.body.token === "undefined" ||
    typeof req.body.email === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let token = req.body.token;
  let email = req.body.email;
  try {
    let decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email == email) {
      res
        .status(200)
        .json({ success: true, message: " 👍 Xác thực token thành công!" });
      return;
    }
    res;
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: " 👎 Xác thực token thất bại!" });
    return;
  }
  res
    .status(404)
    .json({ success: false, message: " 👎 Xác thực token thất bại!" });
};
