"use strict";
import redis_client from "../../../redis_connect.js";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import randomstring from "randomstring";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import crypto from "crypto";
import { generateOTP } from "../utils/otp.js";
import { generateToken } from "../utils/utils.js";
import { sendEmail, sendEmailForgotPassword } from "../utils/nodemailer.js";
import expressAsyncHandler from "express-async-handler";
import HttpError from "http-errors";

export const register = async (req, res) => {
  if (
    typeof req.body.user_name === "undefined" ||
    typeof req.body.email === "undefined" ||
    typeof req.body.password === "undefined" ||
    typeof req.body.firstName === "undefined" ||
    typeof req.body.lastName === "undefined" ||
    // typeof req.body.address === "undefined" ||
    typeof req.body.phone_number === "undefined"
  ) {
    return res.status(401).json({
      result: "error",
      message: "👎 Vui lòng kiểm tra lại các trường đã nhập!",
    });
  }

  let { user_name, email, password, firstName, lastName, phone_number } =
    req.body;
  // console.log(req.body);
  if (
    (email.indexOf("@") === -1 && email.indexOf(".") === -1) ||
    password.length < 6
  ) {
    return res.status(422).json({
      result: "error",
      message: "👎 Email hoặc mật khẩu không hợp lệ!",
    });
  }

  let userFind = null;
  try {
    userFind = await User.find({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ result: "error", message: "👎 Email đã tồn tại!" });
  }

  if (userFind.length > 0) {
    return res
      .status(409)
      .json({ result: "error", message: "👎 Email đã tồn tại!" });
  }

  // const token = randomstring.generate();
  // let send_email = await sendEmail(email, token);
  // if (!send_email) {
  //   return res
  //     .status(500)
  //     .json({ result: "error", message: "👎 Có sự cố xảy ra khi gửi email" });
  // }

  password = bcrypt.hashSync(password, 10);
  const newUser = new User({
    user_name,
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
    // address: address,
    phone_number: phone_number,
    // token: token,
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      result: "error",
      message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
  }

  res.status(201).json({
    status: 201,
    result: "success",
    message: "👍 Đăng ký thành công!",
  });

  const savedToken = new Token({
    user: newUser._id,
    token: randomstring.generate(),
  });
  await savedToken.save();
  // console.log(savedToken);
  let send_email = await sendEmail(email, savedToken.token);
  if (!send_email) {
    return res.status(500).json({
      status: 500,
      result: "error",
      message: "👎 Có sự cố xảy ra khi gửi email",
    });
  }
  // return res
  //   .status(201)
  //   .json({ result: "success", message: "👍 Đăng ký thành công!" });
};

export const resendLink = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  let userFind;
  userFind = await User.findOne({ email });
  if (!userFind) {
    // console.log(userFind);
    throw new HttpError(
      500,
      `👎 User with ${email} does not exist. Please register!`
    );
  }

  if (userFind.is_verify)
    throw new HttpError(
      500,
      "👎 This account has been already verified. Please log in."
    );

  const savedToken = new Token({
    user: userFind._id,
    token: randomstring.generate(),
  });
  await savedToken.save();
  // console.log(savedToken);

  res.status(201).json({
    status: 201,
    result: "success",
    message: "👍 Gửi Token thành công!",
  });

  let send_email = await sendEmail(email, savedToken.token);
  if (!send_email) {
    return res.status(500).json({
      status: 500,
      result: "error",
      message: "👎 Có sự cố xảy ra khi gửi email",
    });
  }
});

export const verifyAccount = async (req, res) => {
  if (typeof req.params.token === "undefined") {
    return res
      .status(402)
      .json({ result: "error", message: "👎 Token không tồn tại" });
  }
  let token = req.params.token;
  let tokenFind = null;
  try {
    tokenFind = await Token.findOne({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ result: "error", message: "👎 Token không tồn tại!" });
  }
  if (tokenFind == null) {
    return res
      .status(404)
      .json({ result: "error", message: "👎 Token không tồn tại!" });
  }
  try {
    await User.findByIdAndUpdate(
      tokenFind.user,
      { $set: { is_verify: true } },
      { new: true }
    );
  } catch (err) {
    return res.status(500).json({
      result: "error",
      message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
  }
  return res
    .status(200)
    .json({ result: "success", message: "👍 Xác thực thành công!" });
};

export const requestForgotPassword = async (req, res) => {
  if (typeof req.params.email === "undefined") {
    return res.status(402).json({
      result: "error",
      message: "👎 Vui lòng kiểm tra lại email đã nhập!",
    });
  }
  let email = req.params.email;
  let userFind = null;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ result: "error", message: "👎 User không tồn tại!" });
  }
  if (userFind == null) {
    return res
      .status(422)
      .json({ result: "error", message: "👎 User không tồn tại!" });
  }
  if (!userFind.is_verify) {
    return res
      .status(401)
      .json({ result: "error", message: "👎 User chưa xác thực!" });
  }

  const savedToken = new Token({
    user: userFind._id,
    token: generateOTP(),
  });
  await savedToken.save();
  // console.log(savedToken);

  // userFind.token = savedToken.token;
  // try {
  //   await userFind.save();
  // } catch (err) {
  //   return res.status(500).json({
  //     result: "error",
  //     message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
  //   });
  // }

  res
    .status(201)
    .json({ status: 201, result: "success", message: "👍 Thành công!", email });

  let send_email = await sendEmailForgotPassword(email, savedToken.token);
  if (!send_email) {
    return res.status(500).json({
      status: 500,
      result: "error",
      message: "👎 Có sự cố xảy ra khi gửi email",
    });
  }

  // let token = generateOTP();
  // let send_email = await sendEmailForgotPassword(email, token);
  // if (!send_email) {
  //   res
  //     .status(500)
  //     .json({ result: "error", message: " 👎 Có sự cố xảy ra khi gửi email!" });
  //   return;
  // }
  // userFind.token = token;
  // try {
  //   await userFind.save();
  // } catch (err) {
  //   res.status(500).json({
  //     result: "error",
  //     message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
  //   });
  //   return;
  // }
  // res
  //   .status(201)
  //   .json({ result: "success", message: " 👍 Thành công!", email: email });
};

export const verifyForgotPassword = async (req, res) => {
  if (
    typeof req.body.email === "undefined" ||
    typeof req.body.otp === "undefined"
  ) {
    return res.status(402).json({
      result: "error",
      message: "👎 Email hoặc mã OTP không hợp lệ!",
    });
  }

  let { email, otp } = req.body;
  let userFind = null;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ result: "error", message: "👎 User không tồn tại!" });
  }
  if (userFind == null) {
    return res
      .status(422)
      .json({ result: "error", message: "👎 User không tồn tại!" });
  }

  let tokenFind = null;
  try {
    tokenFind = await Token.findOne({ token: otp });
  } catch (err) {
    return res.status(500).json({
      result: "error",
      message: "👎 Token không tồn tại hoặc hết hạn!",
    });
  }
  if (tokenFind == null) {
    return res.status(404).json({
      result: "error",
      message: "👎 Token không tồn tại hoặc hết hạn!",
    });
  }

  // if (userFind.token != otp) {
  //   return res.status(422).json({
  //     result: "error",
  //     message: "👎 Token không trùng khớp với mã OTP!",
  //   });
  // }
  return res
    .status(200)
    .json({ status: 200, result: "success", message: "👍 Thành công!", otp });
};

export const forgotPassword = async (req, res) => {
  if (
    typeof req.body.email === "undefined" ||
    typeof req.body.otp === "undefined" ||
    typeof req.body.newPassword === "undefined"
  ) {
    return res.status(402).json({
      success: false,
      message: "👎 Vui lòng kiểm tra lại các trường đã nhập!",
    });
  }
  let { email, otp, newPassword } = req.body;
  let userFind = null;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "👎 User không tồn tại!" });
  }
  if (userFind == null) {
    return res
      .status(422)
      .json({ success: false, message: "👎 User không tồn tại!" });
  }

  let tokenFind = null;
  try {
    tokenFind = await Token.findOne({ token: otp });
  } catch (err) {
    return res.status(500).json({
      result: "error",
      message: "👎 Token không tồn tại hoặc hết hạn!",
    });
  }
  if (tokenFind == null) {
    return res.status(404).json({
      result: "error",
      message: "👎 Token không tồn tại hoặc hết hạn!",
    });
  }

  // if (userFind.token != otp) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "👎 Token không trùng khớp với mã OTP!",
  //   });
  // }
  userFind.password = bcrypt.hashSync(newPassword, 10);
  try {
    await userFind.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
  }
  return res
    .status(201)
    .json({ status: 201, success: true, message: "👍 Thành công!" });
};

export const updateInfor = async (req, res) => {
  if (
    typeof req.body.firstName === "undefined" ||
    typeof req.body.lastName === "undefined" ||
    // typeof req.body.address === "undefined" ||
    typeof req.body.phone_number === "undefined" ||
    typeof req.body.email === "undefined"
  ) {
    return res.status(422).json({
      success: false,
      message: "👎 Vui lòng kiểm tra lại các trường đã nhập!",
    });
  }
  let { email, firstName, lastName, address, phone_number } = req.body;
  let userFind;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "👎 User không tồn tại!" });
  }
  if (userFind === null) {
    return res
      .status(422)
      .json({ success: false, message: "👎 User không tồn tại!" });
  }
  // userFind.user_name = user_name;
  userFind.email = email;
  userFind.firstName = firstName;
  userFind.lastName = lastName;
  // userFind.address = address;
  userFind.phone_number = phone_number;
  try {
    await userFind.save();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
  }
  // let token = generateToken(userFind);
  return res.status(200).json({
    status: 200,
    result: "success",
    message: "👍 Cập nhật thành công!",
    // token: token,
    user: {
      user_name: userFind.user_name,
      email: userFind.email,
      firstName: userFind.firstName,
      lastName: userFind.lastName,
      // address: userFind.address,
      phone_number: userFind.phone_number,
      id: userFind._id,
      // is_admin: userFind.is_admin,
      // role: userFind.role,
    },
  });
  // let token = jwt.sign(
  //   {
  //     _id: userFind._id,
  //     email: email,
  //     is_admin: userFind.is_admin,
  //     iat: Math.floor(Date.now() / 1000) - 60 * 30,
  //   },
  //   process.env.JWT_SECRET
  // );
  // res.status(200).json({
  //   success: true,
  //   message: " 👍 Cập nhật thành công!",
  //   token: token,
  //   user: {
  //     email: userFind.email,
  //     firstName: userFind.firstName,
  //     lastName: userFind.lastName,
  //     // address: userFind.address,
  //     phone_number: userFind.phone_number,
  //     id: userFind._id,
  //   },
  // });
};

export const updatePassword = async (req, res) => {
  if (
    typeof req.body.oldpassword === "undefined" ||
    typeof req.body.newpassword === "undefined" ||
    typeof req.body.email === "undefined"
  ) {
    return res.status(422).json({
      success: false,
      message: "👎 Password nhập vào không trùng khớp hoặc email không hợp lệ!",
    });
  }
  let { email, oldpassword, newpassword } = req.body;
  let userFind = null;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "👎 User không tồn tại!" });
  }
  if (userFind == null) {
    return res
      .status(422)
      .json({ success: false, message: "👎 User không tồn tại!" });
  }
  if (!bcrypt.compareSync(oldpassword, userFind.password)) {
    return res
      .status(422)
      .json({ success: false, message: "👎 Password không trùng khớp!" });
  }
  userFind.password = bcrypt.hashSync(newpassword, 10);
  try {
    await userFind.save();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
  }
  return res
    .status(200)
    .json({ success: true, message: "👍 Đổi mật khẩu thành công!" });
};

// export const login = async (req, res) => {
//   if (
//     typeof req.body.email === "undefined" ||
//     typeof req.body.password == "undefined"
//   ) {
//     res.status(402).json({ msg: "Invalid data" });
//     return;
//   }
//   let { email, password } = req.body;
//   let userFind = null;
//   try {
//     userFind = await user.findOne({ email: email });
//   } catch (err) {
//     res.json({ msg: err });
//     return;
//   }
//   if (userFind == null) {
//     res.status(422).json({ msg: "Invalid data" });
//     return;
//   }
//   if (!userFind.is_verify) {
//     res.status(401).json({ msg: "no_registration_confirmation" });
//     return;
//   }
//   if (!bcrypt.compareSync(password, userFind.password)) {
//     res.status(422).json({ msg: "Invalid data" });
//     return;
//   }
//   let token = jwt.sign(
//     { email: email, iat: Math.floor(Date.now() / 1000) - 60 * 30 },
//     "shhhhh"
//   );
//   res.status(200).json({
//     msg: "success",
//     token: token,
//     user: {
//       email: userFind.email,
//       firstName: userFind.firstName,
//       lastName: userFind.lastName,
//       address: userFind.address,
//       phone_number: userFind.phone_number,
//       id: userFind._id,
//     },
//   });
// };
