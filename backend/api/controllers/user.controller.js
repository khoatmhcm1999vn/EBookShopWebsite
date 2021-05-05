"use strict";
import User from "../models/user.model.js";
import randomstring from "randomstring";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/otp.js";
import { sendEmail, sendEmailForgotPassword } from "../utils/nodemailer.js";

export const register = async (req, res) => {
  if (
    typeof req.body.email === "undefined" ||
    typeof req.body.password === "undefined" ||
    typeof req.body.firstName === "undefined" ||
    typeof req.body.lastName === "undefined" ||
    typeof req.body.address === "undefined" ||
    typeof req.body.phone_number === "undefined"
  ) {
    res.status(422).json({
      result: "error",
      message: " 👎 Vui lòng kiểm tra lại các trường đã nhập!",
    });
    return;
  }
  let {
    email,
    password,
    firstName,
    lastName,
    address,
    birthday,
    phone_number,
  } = req.body;
  if (
    (email.indexOf("@") === -1 && email.indexOf(".") === -1) ||
    password.length < 6
  ) {
    res.status(422).json({
      result: "error",
      message: " 👎 Email hoặc mật khẩu không hợp lệ!",
    });
    return;
  }
  let userFind = null;
  try {
    userFind = await User.find({ email: email });
  } catch (err) {
    res.status(500).json({ result: "error", message: " 👎 Email đã tồn tại!" });
    return;
  }
  if (userFind.length > 0) {
    res.status(409).json({ result: "error", message: " 👎 Email đã tồn tại!" });
    return;
  }
  const token = randomstring.generate();
  let send_email = await sendEmail(email, token);
  if (!send_email) {
    res
      .status(500)
      .json({ result: "error", message: " 👎 Có sự cố xảy ra khi gửi email" });
    return;
  }
  password = bcrypt.hashSync(password, 10);
  const newUser = new User({
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
    address: address,
    birthday: birthday,
    phone_number: phone_number,
    token: token,
  });
  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: "error",
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res
    .status(201)
    .json({ result: "success", message: " 👍 Đăng ký thành công!" });
};

export const verifyAccount = async (req, res) => {
  if (typeof req.params.token === "undefined") {
    res
      .status(402)
      .json({ result: "error", message: " 👎 Token không tồn tại" });
    return;
  }
  let token = req.params.token;
  let tokenFind = null;
  try {
    tokenFind = await User.findOne({ token: token });
  } catch (err) {
    res
      .status(500)
      .json({ result: "error", message: " 👎 User không tồn tại!" });
    return;
  }
  if (tokenFind == null) {
    res
      .status(404)
      .json({ result: "error", message: " 👎 User không tồn tại!" });
    return;
  }
  try {
    await User.findByIdAndUpdate(
      tokenFind._id,
      { $set: { is_verify: true } },
      { new: true }
    );
  } catch (err) {
    res.status(500).json({
      result: "error",
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res
    .status(200)
    .json({ result: "success", message: " 👍 Xác thực thành công!" });
};

export const requestForgotPassword = async (req, res) => {
  if (typeof req.params.email === "undefined") {
    res.status(402).json({
      result: "error",
      message: " 👎 Vui lòng kiểm tra lại email đã nhập!",
    });
    return;
  }
  let email = req.params.email;
  let userFind = null;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    res
      .status(500)
      .json({ result: "error", message: " 👎 User không tồn tại!" });
    return;
  }
  if (userFind == null) {
    res
      .status(422)
      .json({ result: "error", message: " 👎 User không tồn tại!" });
  }
  if (!userFind.is_verify) {
    res
      .status(401)
      .json({ result: "error", message: " 👎 User chưa xác thực!" });
    return;
  }
  let token = generateOTP();
  let send_email = await sendEmailForgotPassword(email, token);
  if (!send_email) {
    res
      .status(500)
      .json({ result: "error", message: " 👎 Có sự cố xảy ra khi gửi email!" });
    return;
  }
  userFind.token = token;
  try {
    await userFind.save();
  } catch (err) {
    res.status(500).json({
      result: "error",
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res
    .status(201)
    .json({ result: "success", message: " 👍 Thành công!", email: email });
};

export const verifyForgotPassword = async (req, res) => {
  if (
    typeof req.body.email === "undefined" ||
    typeof req.body.otp === "undefined"
  ) {
    res.status(402).json({
      result: "error",
      message: " 👎 Email hoặc mã OTP không hợp lệ!",
    });
    return;
  }

  let { email, otp } = req.body;
  let userFind = null;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    res
      .status(500)
      .json({ result: "error", message: " 👎 User không tồn tại!" });
    return;
  }
  if (userFind == null) {
    res
      .status(422)
      .json({ result: "error", message: " 👎 User không tồn tại!" });
    return;
  }
  if (userFind.token != otp) {
    res.status(422).json({
      result: "error",
      message: " 👎 Token không trùng khớp với mã OTP!",
    });
    return;
  }
  res
    .status(200)
    .json({ result: "success", message: " 👍 Thành công!", otp: otp });
};

export const forgotPassword = async (req, res) => {
  if (
    typeof req.body.email === "undefined" ||
    typeof req.body.otp === "undefined" ||
    typeof req.body.newPassword === "undefined"
  ) {
    res.status(402).json({
      success: false,
      message: " 👎 Vui lòng kiểm tra lại các trường đã nhập!",
    });
    return;
  }
  let { email, otp, newPassword } = req.body;
  let userFind = null;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: " 👎 User không tồn tại!" });
    return;
  }
  if (userFind == null) {
    res
      .status(422)
      .json({ success: false, message: " 👎 User không tồn tại!" });
    return;
  }
  if (userFind.token != otp) {
    res.status(422).json({
      success: false,
      message: " 👎 Token không trùng khớp với mã OTP!",
    });
    return;
  }
  userFind.password = bcrypt.hashSync(newPassword, 10);
  try {
    await userFind.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res.status(201).json({ success: true, message: " 👍 Thành công!" });
};

export const updateInfor = async (req, res) => {
  if (
    typeof req.body.firstName === "undefined" ||
    typeof req.body.lastName === "undefined" ||
    // typeof req.body.address === "undefined" ||
    typeof req.body.phone_number === "undefined" ||
    typeof req.body.email === "undefined"
  ) {
    res.status(422).json({
      success: false,
      message: " 👎 Vui lòng kiểm tra lại các trường đã nhập!",
    });
    return;
  }
  let { email, firstName, lastName, address, phone_number } = req.body;
  let userFind;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: " 👎 User không tồn tại!" });
    return;
  }
  if (userFind === null) {
    res
      .status(422)
      .json({ success: false, message: " 👎 User không tồn tại!" });
    return;
  }
  userFind.firstName = firstName;
  userFind.lastName = lastName;
  // userFind.address = address;
  userFind.phone_number = phone_number;
  try {
    await userFind.save();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  let token = jwt.sign(
    {
      _id: userFind._id,
      email: email,
      is_admin: userFind.is_admin,
      iat: Math.floor(Date.now() / 1000) - 60 * 30,
    },
    process.env.JWT_SECRET
  );
  res.status(200).json({
    success: true,
    message: " 👍 Cập nhật thành công!",
    token: token,
    user: {
      email: userFind.email,
      firstName: userFind.firstName,
      lastName: userFind.lastName,
      // address: userFind.address,
      phone_number: userFind.phone_number,
      id: userFind._id,
    },
  });
};

export const updatePassword = async (req, res) => {
  if (
    typeof req.body.oldpassword === "undefined" ||
    typeof req.body.newpassword === "undefined" ||
    typeof req.body.email === "undefined"
  ) {
    res.status(422).json({
      success: false,
      message:
        " 👎 Password nhập vào không trùng khớp hoặc email không hợp lệ!",
    });
    return;
  }
  let { email, oldpassword, newpassword } = req.body;
  let userFind = null;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: " 👎 User không tồn tại!" });
    return;
  }
  if (userFind == null) {
    res
      .status(422)
      .json({ success: false, message: " 👎 User không tồn tại!" });
    return;
  }
  if (!bcrypt.compareSync(oldpassword, userFind.password)) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Password không trùng khớp!" });
    return;
  }
  userFind.password = bcrypt.hashSync(newpassword, 10);
  try {
    await userFind.save();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res
    .status(200)
    .json({ success: true, message: " 👍 Đổi mật khẩu thành công!" });
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
