"use strict";
import expressAsyncHandler from "express-async-handler";
import Bill from "../models/bill.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import UserAddress from "../models/address.model.js";

import randomstring from "randomstring";
import { sendMailConfirmPayment } from "../utils/nodemailer.js";

export const addBill = async (req, res) => {
  // if (
  //   typeof req.body.id_user === "undefined" ||
  //   typeof req.body.city === "undefined" ||
  //   typeof req.body.district === "undefined" ||
  //   typeof req.body.ward === "undefined" ||
  //   typeof req.body.address === "undefined" ||
  //   typeof req.body.phone === "undefined" ||
  //   typeof req.body.name === "undefined" ||
  //   typeof req.body.email === "undefined"
  // ) {
  //   res
  //     .status(422)
  //     .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
  //   return;
  // }
  const {
    id_user,
    city,
    district,
    ward,
    address,
    phone,
    name,
    email,
  } = req.body;
  var cartFind = null;
  try {
    cartFind = await Cart.findOne({ id_user: id_user });
  } catch (err) {
    console.log("error ", err);
    res
      .status(500)
      .json({ success: false, message: " 👎 Cart không tồn tại!" });
    return;
  }
  if (cartFind === null) {
    res
      .status(404)
      .json({ success: false, message: " 👎 Cart không tồn tại!" });
    return;
  }
  const token = randomstring.generate();
  let sendEmail = await sendMailConfirmPayment(email, token);
  if (!sendEmail) {
    res
      .status(500)
      .json({ success: false, message: " 👎 Có lỗi xảy ra khi gửi email!" });
    return;
  }
  const new_bill = new Bill({
    id_user: id_user,
    products: cartFind.products,
    city: city,
    district: district,
    ward: ward,
    address: address,
    phone: phone,
    name: name,
    token: token,
  });
  try {
    await cartFind.remove();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: " 👎 Có lỗi xảy ra khi lưu trong database!",
    });
    console.log("cart remove fail");
    return;
  }
  try {
    new_bill.save();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: " 👎 Có lỗi xảy ra khi lưu trong database!",
    });
    console.log("save bill fail");
    return;
  }
  res.status(201).json({ success: true, message: " 👍 Thêm mới thành công!" });
};

export const verifyPayment = async (req, res) => {
  if (typeof req.params.token === "undefined") {
    res
      .status(402)
      .json({ result: "error", message: " 👎 Token không hợp lệ!" });
    return;
  }
  let token = req.params.token;
  let tokenFind = null;
  try {
    tokenFind = await Bill.findOne({ token: token });
  } catch (err) {
    res
      .status(500)
      .json({ result: "error", message: " 👎 Bill không tồn tại!" });
    return;
  }
  if (tokenFind == null) {
    res
      .status(404)
      .json({ result: "error", message: " 👎 Bill không tồn tại!" });
    return;
  }
  try {
    await Bill.findByIdAndUpdate(
      tokenFind._id,
      { $set: { issend: true } },
      { new: true }
    );
  } catch (err) {
    res.status(500).json({
      result: "error",
      message: " 👎 Có lỗi xảy ra khi lưu trong database!",
    });
    return;
  }
  res
    .status(200)
    .json({ result: "success", message: " 👍 Xác nhận thành công!" });
};

export const getBillByIDUser = async (req, res) => {
  if (typeof req.params.id_user === "undefined") {
    res.status(402).json({ msg: "data invalid" });
    return;
  }
  let billFind = null;
  try {
    billFind = await Bill.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
    return;
  }
  res.status(200).json({ data: billFind });
};

export const deleteBill = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res
      .status(402)
      .json({ result: "error", message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let billFind = null;
  try {
    billFind = await Bill.findOne({ _id: req.params.id, issend: false });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ result: "error", message: " 👎 Bill không tồn tại!" });
    return;
  }
  if (billFind === null) {
    res
      .status(400)
      .json({ result: "error", message: " 👎 Bill không tồn tại!" });
    return;
  }
  try {
    billFind.remove();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: "error",
      message: " 👎 Có lỗi xảy ra khi lưu trong database!",
    });
    return;
  }
  res.status(200).json({ result: "success", message: " 👍 Xóa thành công!" });
};
export const deactivateBill = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res
      .status(402)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let billFind = null;
  try {
    billFind = await Bill.findOne({ _id: req.params.id });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: " 👎 Bill không tồn tại!" });
    return;
  }
  if (billFind === null) {
    res
      .status(400)
      .json({ success: false, message: " 👎 Bill không tồn tại!" });
    return;
  }
  try {
    if (billFind.issend === true) billFind.issend = false;
    else billFind.issend = true;
    await billFind.save();
    // billFind.remove();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Có lỗi xảy ra khi lưu trong database!",
    });
    return;
  }
  res.status(200).json({ success: true, message: " 👍 Thành công!" });
};
export const deliverBill = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res
      .status(402)
      .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let billFind = null;
  try {
    billFind = await Bill.findOne({ _id: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "👎 Bill không tồn tại!" });
    return;
  }
  if (billFind === null) {
    res.status(400).json({ success: false, message: "👎 Bill không tồn tại!" });
    return;
  }
  try {
    if (billFind.isDelivered === true) {
      billFind.isDelivered = false;
      billFind.deliveredAt = Date.now();
    } else {
      billFind.isDelivered = true;
      billFind.deliveredAt = Date.now();
    }
    await billFind.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "👎 Có lỗi xảy ra khi lưu trong database!",
    });
    return;
  }
  res.status(200).json({ success: true, message: "👍 Thành công!" });
};

export const statisticalTop10 = async (req, res) => {
  let billFind = null;
  try {
    billFind = await Bill.find({ isPaid: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
  let arr = [];
  let len = billFind.length;
  for (let i = 0; i < len; i++) {
    let lenP = billFind[i].products.length;
    for (let j = 0; j < lenP; j++) {
      let index = arr.findIndex(
        (element) => billFind[i].products[j]._id === element._id
      );
      if (index === -1) {
        arr.push(billFind[i].products[j]);
      } else {
        arr[index].count += Number(billFind[i].products[j].count);
      }
    }
  }
  arr.sort(function (a, b) {
    return b.count - a.count;
  });
  res.status(200).json({ data: arr.length > 10 ? arr.slice(0, 10) : arr });
};
export const statisticaRevenueDay = async (req, res) => {
  if (
    typeof req.body.day === "undefined" ||
    typeof req.body.month === "undefined" ||
    typeof req.body.year === "undefined"
  ) {
    res.status(402).json({ msg: "data invalid" });
    return;
  }
  let { day, month, year } = req.body;
  let billFind = null;
  try {
    billFind = await Bill.find({
      createdAt: {
        $gte: new Date(year, month - 1, day),
        $lt: new Date(year, month - 1, parseInt(day) + 1),
      },
      isDelivered: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).msg({ msg: err });
    return;
  }
  res.status(200).json({ data: billFind });
};
export const statisticaRevenueMonth = async (req, res) => {
  if (
    typeof req.body.year === "undefined" ||
    typeof req.body.month === "undefined"
  ) {
    res.status(402).json({ msg: "data invalid" });
    return;
  }
  let { month, year } = req.body;
  let billFind = null;
  try {
    billFind = await Bill.find({
      createdAt: {
        $gte: new Date(year, parseInt(month) - 1, 1),
        $lt: new Date(year, month, 1),
      },
      isDelivered: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).msg({ msg: err });
    return;
  }
  res.status(200).json({ data: billFind });
};
export const statisticaRevenueYear = async (req, res) => {
  if (typeof req.body.year === "undefined") {
    res.status(402).json({ msg: "data invalid" });
    return;
  }
  let { year } = req.body;
  let billFind = null;
  try {
    billFind = await Bill.find({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(parseInt(year) + 1, 0, 1),
      },
      isDelivered: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).msg({ msg: err });
    return;
  }
  res.status(200).json({ data: billFind });
};
export const statisticaRevenueQuauter = async (req, res) => {
  if (
    typeof req.body.year === "undefined" ||
    typeof req.body.quauter === "undefined"
  ) {
    res.status(402).json({ msg: "data invalid" });
    return;
  }
  let { year, quauter } = req.body;
  if (quauter < 1 || quauter > 4) {
    res.status(402).json({ msg: "data invalid" });
    return;
  }
  let start = 1,
    end = 4;
  if (parseInt(quauter) === 2) {
    start = 4;
    end = 7;
  }
  if (parseInt(quauter) === 3) {
    start = 7;
    end = 10;
  }
  if (parseInt(quauter) === 3) {
    start = 10;
    end = 13;
  }
  let billFind = null;
  try {
    billFind = await Bill.find({
      createdAt: {
        $gte: new Date(year, start - 1, 1),
        $lt: new Date(year, end - 1, 1),
      },
      isDelivered: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).msg({ msg: err });
    return;
  }
  res.status(200).json({ data: billFind });
};

export const getBillNoVerify = expressAsyncHandler(async (req, res) => {
  let count = null;
  try {
    count = await Bill.countDocuments({ isDelivered: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = parseInt((count - 1) / 9 + 1);
  let { page } = req.params;
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  let addressFind;
  try {
    addressFind = await Bill.aggregate([
      { $match: { isDelivered: false } },
      {
        $lookup: {
          from: "useraddresses",
          localField: "addressId",
          foreignField: "address._id",
          as: "bills",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: 9 * (parseInt(page) - 1) },
      { $limit: 9 },
    ]);
    await Bill.populate(addressFind, {
      path: "user",
      select: { _id: 1, phone_number: 1, firstName: 1 },
    });
    // console.log(addressFind);
    res.status(200).json({ data: addressFind, totalPage });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
});
export const getBillVerify = async (req, res) => {
  let count = null;
  try {
    count = await Bill.countDocuments({ isDelivered: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = parseInt((count - 1) / 9 + 1);
  let { page } = req.params;
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  let addressFind;
  try {
    addressFind = await Bill.aggregate([
      { $match: { isDelivered: true } },
      {
        $lookup: {
          from: "useraddresses",
          localField: "addressId",
          foreignField: "address._id",
          as: "bills",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: 9 * (parseInt(page) - 1) },
      { $limit: 9 },
    ]);
    await Bill.populate(addressFind, {
      path: "user",
      select: { _id: 1, phone_number: 1, firstName: 1 },
    });
    res.status(200).json({ data: addressFind, totalPage });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }

  // let count = null;
  // try {
  //   count = await Bill.count({ issend: true });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ msg: err });
  //   return;
  // }
  // let totalPage = parseInt((count - 1) / 9 + 1);
  // let { page } = req.params;
  // if (parseInt(page) < 1 || parseInt(page) > totalPage) {
  //   res.status(200).json({ data: [], msg: "Invalid page", totalPage });
  //   return;
  // }
  // Bill.find({ isDelivered: true })
  //   .skip(9 * (parseInt(page) - 1))
  //   .limit(9)
  //   .exec((err, docs) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).json({ msg: err });
  //       return;
  //     }
  //     res.status(200).json({ data: docs, totalPage });
  //   });
};
