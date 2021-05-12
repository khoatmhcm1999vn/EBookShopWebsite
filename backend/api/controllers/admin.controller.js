"use strict";
import cloudinary from "cloudinary";
var cloudinaryConfig = cloudinary.v2;
// var uploads = {};
cloudinaryConfig.config({
  cloud_name: "dhjbnicrr",
  api_key: "716683488489554",
  api_secret: "lXvFAP3e8kp93s6D2hgc_C_hy3Y",
});

import Book from "../models/book.model.js";
import User from "../models/user.model.js";
import UserAddress from "../models/address.model.js";
import Category from "../models/category.model.js";
import Author from "../models/author.model.js";
import Publisher from "../models/publisher.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import expressAsyncHandler from "express-async-handler";

import excel from "exceljs";
import excelToJson from "convert-excel-to-json";
import mongoose from "mongoose";

import { generateToken } from "../utils/utils.js";

const uploadImg = async (path) => {
  let res;
  try {
    res = await cloudinaryConfig.uploader.upload(path);
  } catch (err) {
    console.log(err);
    return false;
  }
  return res.secure_url;
};

export const addBook = async (req, res) => {
  if (
    typeof req.file === "undefined" ||
    typeof req.body.name === "undefined" ||
    typeof req.body.id_category === "undefined" ||
    typeof req.body.quantity === "undefined" ||
    typeof req.body.published === "undefined" ||
    typeof req.body.price === "undefined" ||
    typeof req.body.createdAt === "undefined" ||
    typeof req.body.describe === "undefined" ||
    typeof req.body.id_nsx === "undefined" ||
    typeof req.body.id_author === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  const {
    id_category,
    name,
    price,
    quantity,
    published,
    createdAt,
    describe,
    id_nsx,
    id_author,
  } = req.body;
  let urlImg = await uploadImg(req.file.path);
  if (urlImg === false) {
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi upload ảnh lên cloud!",
    });
    return;
  }
  const newBook = new Book({
    id_category: id_category,
    name: name,
    price: price,
    quantity,
    published,
    createdAt: createdAt,
    img: urlImg,
    describe: describe,
    id_nsx: id_nsx,
    id_author: id_author,
  });
  try {
    newBook.save();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  fs.unlink(req.file.path, (err) => {
    if (err) throw err;
    console.log("path/file.txt was deleted");
  });
  res.status(201).json({ success: true, message: " 👍 Thêm mới thành công!" });
};

export const updateBook = async (req, res) => {
  if (
    typeof req.body.name === "undefined" ||
    typeof req.body.id === "undefined" ||
    typeof req.body.id_category === "undefined" ||
    typeof req.body.quantity === "undefined" ||
    typeof req.body.published === "undefined" ||
    typeof req.body.price === "undefined" ||
    typeof req.body.createdAt === "undefined" ||
    typeof req.body.describe === "undefined" ||
    typeof req.body.id_nsx === "undefined" ||
    typeof req.body.id_author === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let {
    name,
    id,
    id_category,
    price,
    quantity,
    published,
    createdAt,
    describe,
    id_nsx,
    id_author,
  } = req.body;
  let bookFind;
  try {
    bookFind = await Book.findById(id);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: " 👎 Book không tồn tại!" });
    return;
  }
  if (bookFind === null) {
    res
      .status(404)
      .json({ success: false, message: " 👎 Book không tồn tại!" });
    return;
  }
  let urlImg = null;
  // console.log(req.file);
  if (req.file) {
    if (typeof req.file !== "undefined") {
      urlImg = await uploadImg(req.file.path);
    }
    if (urlImg !== null) {
      if (urlImg === false) {
        res.status(500).json({
          success: false,
          message: " 👎 Có sự cố xảy ra khi upload ảnh lên cloud!",
        });
        return;
      }
    }
    if (urlImg === null) urlImg = bookFind.img;
    console.log(urlImg);
    // console.log(bookFind);
    // res.json({ msg: "fail" });
    // return;
    bookFind.id_category = id_category;
    bookFind.name = name;
    bookFind.price = parseFloat(price);
    bookFind.quantity = parseFloat(quantity);
    bookFind.published = published;
    bookFind.createdAt = createdAt;
    bookFind.describe = describe;
    bookFind.id_nsx = id_nsx;
    bookFind.id_author = id_author;
    bookFind.img = urlImg;
    bookFind.save((err, docs) => {
      if (err) {
        console.log(err);
      }
    });
    fs.unlink(req.file.path, (err) => {
      if (err) throw err;
      console.log("path/file.txt was deleted");
    });
    res.status(200).json({
      success: true,
      message: " 👍 Cập nhật thành công!",
      data: bookFind,
    });
  } else {
    if (urlImg === null) urlImg = bookFind.img;
    bookFind.id_category = id_category;
    bookFind.name = name;
    bookFind.price = parseFloat(price);
    bookFind.quantity = parseFloat(quantity);
    bookFind.published = published;
    bookFind.createdAt = createdAt;
    bookFind.describe = describe;
    bookFind.id_nsx = id_nsx;
    bookFind.id_author = id_author;
    bookFind.img = urlImg;
    bookFind.save((err, docs) => {
      if (err) {
        console.log(err);
      }
    });
    // fs.unlink(req.file.path, (err) => {
    //   if (err) throw err;
    //   console.log("path/file.txt was deleted");
    // });
    res
      .status(200)
      .json({ success: true, message: " 👍 Thành công!", data: bookFind });
  }
};

export const deletebook = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res.json({ result: "error", message: "👎 Dữ liệu Book bị lỗi!" });
    return;
  }

  let bookFind;
  try {
    bookFind = await Book.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res.json({ result: "error", message: "👎 Không tìm thấy Book!" });
    return;
  }

  bookFind.remove();
  res.json({ result: "success", message: "👍 Xóa thành công!" });
};

export const deactivateBook = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu Book bị lỗi!" });
    return;
  }
  let bookFind;
  try {
    bookFind = await Book.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: " 👎 Không tìm thấy Book!" });
    return;
  }
  if (!bookFind.published) bookFind.published = true;
  else bookFind.published = false;
  await bookFind.save();
  // bookFind.remove();
  res
    .status(200)
    .json({ success: true, message: " 👍 Thành công!", data: bookFind });
};

export const addPublisher = async (req, res) => {
  if (typeof req.body.name === "undefined") {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let { name } = req.body;
  let publisherFind;
  try {
    publisherFind = await Publisher.find({ name: name });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: " 👎 Publisher đã tồn tại!" });
    return;
  }
  if (publisherFind.length > 0) {
    res
      .status(409)
      .json({ success: false, message: " 👎 Publisher đã tồn tại!" });
    return;
  }
  const newPublisher = new Publisher({ name: name });
  try {
    await newPublisher.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res.status(201).json({ success: true, message: " 👍 Thêm mới thành công!" });
};

export const updatePublisher = async (req, res) => {
  if (
    typeof req.body.id === "undefined" ||
    typeof req.body.name === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let { id, name } = req.body;
  let publisherFind;
  try {
    publisherFind = await Publisher.findById(id);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: " 👎 Publisher không tồn tại!" });
    return;
  }
  if (publisherFind === null) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Publisher không tồn tại!" });
    return;
  }
  publisherFind.name = name;
  try {
    await publisherFind.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res.status(201).json({
    success: true,
    message: " 👍 Cập nhật thành công!",
    publisher: { name: name },
  });
};

export const deletePublisher = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res
      .status(422)
      .json({ result: "error", message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  await Book.updateMany(
    { id_nsx: { $in: req.params.id } },
    { published: false },
    { $set: { published: true } }
  );
  let publisherFind;
  try {
    publisherFind = await Publisher.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: "error",
      message: " 👎 Không tìm thấy dữ liệu Publisher!",
    });
    return;
  }
  publisherFind.isEnabled = false;
  await publisherFind.save();
  res.status(200).json({ result: "success", message: " 👍 Xóa thành công!" });
};

export const deactivatePublisher = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let publisherFind;
  try {
    publisherFind = await Publisher.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Không tìm thấy dữ liệu Publisher!",
    });
    return;
  }
  if (!publisherFind.isEnabled) publisherFind.isEnabled = true;
  else publisherFind.isEnabled = false;
  await publisherFind.save();
  res.status(200).json({
    success: true,
    message: " 👍 Thành công!",
    data: publisherFind,
  });
};

export const addCategory = async (req, res) => {
  if (typeof req.body.name === "undefined") {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let { name } = req.body;
  let categoryFind;
  try {
    categoryFind = await Category.find({ name: name });
  } catch (err) {
    res.status(500).json({ success: false, message: " 👎 Category tồn tại!" });
    return;
  }
  if (categoryFind.length > 0) {
    res.status(409).json({ success: false, message: " 👎 Category tồn tại!" });
    return;
  }
  const newCategory = new Category({ name: name });
  try {
    await newCategory.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res.status(201).json({ success: true, message: " 👍 Thêm mới thành công!" });
};

export const updateCategory = async (req, res) => {
  if (
    typeof req.body.id === "undefined" ||
    typeof req.body.name === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let { id, name } = req.body;
  let categoryFind;
  try {
    categoryFind = await Category.findById(id);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: " 👎 Category không tồn tại!" });
    return;
  }
  if (categoryFind === null) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Category không tồn tại!" });
    return;
  }
  categoryFind.name = name;
  try {
    await categoryFind.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Có vấn đề xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res.status(201).json({
    success: true,
    message: " 👍 Cập nhật thành công!",
    category: { name: name },
  });
};

export const deleteCategory = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res
      .status(422)
      .json({ result: "error", message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  await Book.updateMany(
    { id_category: { $in: req.params.id } },
    { published: false },
    { $set: { published: true } }
  );
  let categoryFind;
  try {
    categoryFind = await Category.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: "error",
      message: " 👎 Không tìm thấy dữ liệu Category!",
    });
    return;
  }
  categoryFind.isEnabled = false;
  await categoryFind.save();
  res.status(200).json({ result: "success", message: " 👍 Xóa thành công!" });
};

export const deactivateCategory = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let categoryFind;
  try {
    categoryFind = await Category.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Không tìm thấy dữ liệu Category!",
    });
    return;
  }
  if (!categoryFind.isEnabled) categoryFind.isEnabled = true;
  else categoryFind.isEnabled = false;
  await categoryFind.save();
  res.status(200).json({
    success: true,
    message: " 👍 Thành công!",
    data: categoryFind,
  });
};

export const deactivateAuthor = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let authorFind;
  try {
    authorFind = await Author.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: " 👎 Không tìm thấy dữ liệu Author!" });
    return;
  }
  if (!authorFind.isEnabled) authorFind.isEnabled = true;
  else authorFind.isEnabled = false;
  await authorFind.save();
  res.status(200).json({
    success: true,
    message: " 👍 Thành công!",
    data: authorFind,
  });
};

export const deleteAuthor = async (req, res) => {
  if (typeof req.params.id === "undefined") {
    // res.status(422).json({ msg: "Invalid data" });
    res
      .status(422)
      .json({ result: "error", message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }

  await Book.updateMany(
    { id_author: { $in: req.params.id } },
    { published: false },
    { $set: { published: true } }
  );

  let authorFind;
  try {
    authorFind = await Author.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ result: "error", message: " 👎 Không tìm thấy dữ liệu Author!" });
    return;
  }
  authorFind.isEnabled = false;
  await authorFind.save();
  // authorFind.remove();
  res.status(200).json({ result: "success", message: " 👍 Xóa thành công!" });
};

export const addAuthor = async (req, res) => {
  if (typeof req.body.name === "undefined") {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu Author nhập vào bị lỗi!" });
    return;
  }
  let { name } = req.body;
  let authorFind;
  try {
    authorFind = await Author.find({ name: name });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: " 👎 Không tìm thấy Author!" });
    return;
  }
  if (authorFind.length > 0) {
    res.status(409).json({ success: false, message: " 👎 Author đã tồn tại!" });
    return;
  }
  const newAuthor = new Author({ name: name });
  try {
    await newAuthor.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: " 👎 Thêm mới thất bại!" });
    return;
  }
  res.status(201).json({ success: true, message: " 👍 Thêm mới thành công!" });
};

export const updateAuthor = async (req, res) => {
  if (
    typeof req.body.id === "undefined" ||
    typeof req.body.name === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liệu Author bị lỗi!" });
    return;
  }
  let { id, name } = req.body;
  let authorFind;
  try {
    authorFind = await Author.findById(id);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: " 👎 Không tìm thấy Author!" });
    return;
  }
  if (authorFind === null) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Author không tồn tại!" });
    return;
  }
  authorFind.name = name;
  try {
    await authorFind.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi lưu dữ liệu Author vào database!",
    });
    return;
  }
  res.status(201).json({
    success: true,
    message: " 👍 Cập nhật thành công!",
    author: { name: name },
  });
};

export const getAllUser = async (req, res) => {
  if (typeof req.params.page === "undefined") {
    res.status(402).json({ msg: "Data invalid" });
    return;
  }

  let count = null;
  try {
    count = await UserAddress.count({});
    console.log(count);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }

  // let addressObj = null;
  // try {
  //   addressObj = await UserAddress.find({ __v: 0 }).populate(
  //     "user",
  //     "select firstName phone_number"
  //   );
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ success: false, message: "👎 Không tìm thấy!" });
  //   return;
  // }
  // if (addressObj === null) {
  //   res.status(400).json({
  //     data: [],
  //     success: false,
  //     message: "👎 Address không tồn tại!",
  //   });
  //   return;
  // }
  // res
  //   .status(200)
  //   .json({ success: true, message: "👍 Thành công!", address: addressObj });
  // res.json({ msg: "fail" });
  // return;

  let totalPage = parseInt((count - 1) / 9 + 1);
  let { page } = req.params;
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }

  UserAddress.find({}, { __v: 0 })
    .skip(9 * (parseInt(page) - 1))
    .limit(9)
    .populate(
      "user",
      "select firstName lastName email phone_number is_verify is_admin createdAt"
    )
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
      res.status(200).json({ data: docs, totalPage });
    });
};

export const addUser = async (req, res) => {
  if (
    typeof req.body.email === "undefined" ||
    typeof req.body.password === "undefined" ||
    typeof req.body.firstName === "undefined" ||
    typeof req.body.lastName === "undefined" ||
    // typeof req.body.address === "undefined" ||
    typeof req.body.phone_number === "undefined" ||
    typeof req.body.is_admin === "undefined"
  ) {
    res.json({ success: false, message: "👎 Dữ liệu User bị lỗi!" });
    return;
  }

  let {
    email,
    password,
    firstName,
    lastName,
    // address,
    phone_number,
    is_admin,
  } = req.body;

  let userFind = null;
  try {
    userFind = await User.find({ email: email });
  } catch (err) {
    res.json({ success: false, message: "👎 User đã tồn tại!" });
    // console.log(1);
    return;
  }

  if (userFind.length > 0) {
    res.json({ success: false, message: "👎 Email nhập đã tồn tại!" });
    return;
  }

  password = bcrypt.hashSync(password, 10);
  const newUser = new User({
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
    // address: address,
    phone_number: phone_number,
    is_verify: true,
    is_admin: is_admin,
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "👎 Có sự cố khi lưu vào trong database!",
    });
    return;
  }

  res.status(201).json({ success: true, message: "👍 Thêm mới thành công!" });
};

export const updateUser = async (req, res) => {
  if (
    typeof req.body.email === "undefined" ||
    typeof req.body.firstName === "undefined" ||
    typeof req.body.lastName === "undefined" ||
    // typeof req.body.address === "undefined" ||
    typeof req.body.phone_number === "undefined" ||
    typeof req.body.is_admin === "undefined"
  ) {
    res.json({ success: false, message: "👎 Dữ liệu User bị lỗi!" });
    return;
  }

  let {
    email,
    firstName,
    lastName,
    // address,
    phone_number,
    is_admin,
  } = req.body;

  let userFind;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    res.json({ success: false, message: "👎 User đã tồn tại!" });
    return;
  }

  if (userFind === null) {
    res.json({ success: false, message: "👎 Không tìm thấy User!" });
    return;
  }

  userFind.firstName = firstName;
  userFind.lastName = lastName;
  // userFind.address = address;
  userFind.phone_number = phone_number;
  userFind.is_admin = is_admin;

  try {
    await userFind.save();
  } catch (err) {
    res.json({
      success: false,
      message: "👎 Có sự cố xảy ra khi lưu vào database",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "👍 Cập nhật thành công!",
    user: {
      email: userFind.email,
      firstName: userFind.firstName,
      lastName: userFind.lastName,
      // address: userFind.address,
      phone_number: userFind.phone_number,
      is_admin: userFind.is_admin,
    },
  });
};

export const deleteUser = async (req, res) => {
  if (typeof req.body.email === "undefined") {
    res.json({ result: "error", message: "👎 Email đã nhập không tồn tại!" });
    return;
  }

  let userFind;

  try {
    userFind = await User.findOne({ email: req.body.email });
  } catch (err) {
    res.json({ result: "error", message: "👎 Không tìm thấy User!" });
    return;
  }

  userFind.remove();

  res.status(200).json({ result: "success", message: "👍 Xóa thành công!" });
};

export const deactivateUser = async (req, res) => {
  if (typeof req.body.email === "undefined") {
    res.json({ success: false, message: "👎 Email đã nhập không tồn tại!" });
    return;
  }

  let userFind;

  try {
    userFind = await User.findOne({ email: req.body.email });
  } catch (err) {
    res.json({ success: false, message: "👎 Không tìm thấy User!" });
    return;
  }

  if (userFind.is_verify === true) userFind.is_verify = false;
  else userFind.is_verify = true;

  await userFind.save();

  res.status(200).json({ success: true, message: "👍 Thành công!" });
};

export const login = async (req, res) => {
  if (
    typeof req.body.email === "undefined" ||
    typeof req.body.password == "undefined"
  ) {
    res.json({ result: "error", message: "👎 Sai email hoặc mật khẩu!" });
    return;
  }

  let { email, password } = req.body;
  let userFind = null;
  try {
    userFind = await User.findOne({ email: email });
  } catch (err) {
    res.json({ result: "error", message: "👎 User không tồn tại!" });
    return;
  }

  if (userFind == null) {
    res.json({ result: "error", message: "👎 User không tồn tại!" });
    return;
  }

  if (!userFind.is_verify) {
    res.json({ result: "error", message: "👎 User chưa xác thực!" });
    return;
  }

  if (!bcrypt.compareSync(password, userFind.password)) {
    res.json({ result: "error", message: "👎 Mật khẩu không đúng!" });
    return;
  }

  let token = generateToken(userFind);

  // let token = jwt.sign(
  //   {
  //     _id: userFind._id,
  //     email: email,
  //     is_admin: userFind.is_admin,
  //     iat: Math.floor(Date.now() / 1000) - 60 * 30,
  //   },
  //   process.env.JWT_SECRET
  // );

  res.status(200).json({
    result: "success",
    message: "👍 Đăng nhập thành công!",
    token: token,
    user: {
      email: userFind.email,
      firstName: userFind.firstName,
      lastName: userFind.lastName,
      // address: userFind.address,
      phone_number: userFind.phone_number,
      id: userFind._id,
      is_admin: userFind.is_admin,
    },
  });
};

export const meController = (req, res) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.json({
      success: false,
      message: "Unauthorization",
    });
  }

  // const token = authorization.split(" ")[1];

  const token = authorization;
  if (!token || token === "") {
    return res.json({
      success: false,
      message: "Unauthorization",
    });
  }

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decodeToken._id)
      .select("firstName is_admin _id email")
      .exec((err, user) => {
        if (err || !user) {
          return res.json({
            success: false,
            message: "Unauthorization 3",
          });
        }
        return res.json({
          success: true,
          message: "OK",
          user,
        });
      });
  } catch (err) {
    return res.json({
      success: false,
      message: "Unauthorization 4",
    });
  }
};

export const excelController = expressAsyncHandler(
  async (req, res, next, error) => {
    try {
      if (req.file == undefined) {
        return res.send({
          success: false,
          message: "👍 Please upload an excel file!!",
        });
        // ("Please upload an excel file!");
      }

      let filePath = req.file.path;
      console.log(filePath);
      // -> Read Excel File to Json Data

      const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [
          {
            // Excel Sheet Name
            name: "Authors",
            // Header Row -> be skipped and will not be present at our result object.
            header: {
              rows: 1,
            },
            // Mapping columns to keys
            columnToKey: {
              A: "_id",
              B: "name",
              C: "isEnabled",
              D: "image",
            },
          },
        ],
      });

      // -> Log Excel Data to Console
      // console.log(excelData);

      function convertToObjectId(id) {
        const id_obj = mongoose.Types.ObjectId(id);
        return id_obj;
      }

      function stringToBoolean(string) {
        switch (string.toLowerCase().trim()) {
          case "true":
          case "yes":
          case "1":
            return true;
          case "false":
          case "no":
          case "0":
          case null:
            return false;
          default:
            return Boolean(string);
        }
      }

      // const id = stringToBoolean(strObj.string);
      // console.log(id);
      // if (typeof id === "boolean") {
      //   // variable is a boolean
      //   console.log(true);
      // }
      // console.log(ObjectId.isValid(id));

      excelData.Authors.map((e, i) => {
        e._id = convertToObjectId(e._id);
        e.isEnabled = stringToBoolean(e.isEnabled);
      });
      // console.log(excelData);

      await Author.insertMany(excelData.Authors, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          // console.log("Number of documents inserted: " + data);
          res.status(201).json({
            success: true,
            message: "👍 Import thành công!",
          });
        }
      });
      fs.unlinkSync(filePath);

      //   Author.bulkCreate(tutorials)
      //     .then(() => {
      //       res.status(200).send({
      //         message:
      //           "Uploaded the file successfully: " + req.file.originalname,
      //       });
      //     })
      //     .catch((error) => {
      //       res.status(500).send({
      //         message: "Fail to import data into database!",
      //         error: error.message,
      //       });
      //     });
      // });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
      });
    }
  }
);

export const excelDownloadController = expressAsyncHandler(async (req, res) => {
  const authors = await Author.find({});
  // console.log(authors);

  let workbook = new excel.Workbook(); //creating workbook
  let worksheet = workbook.addWorksheet("Authors"); //creating worksheet

  //  WorkSheet Header
  worksheet.columns = [
    { header: "Id", key: "_id", width: 10 },
    { header: "Name", key: "name", width: 30 },
    // { header: "Address", key: "address", width: 30 },
    { header: "Published", key: "isEnabled", width: 10 },
    { header: "Image", key: "image", width: 20 },
  ];

  // Add Array Rows
  worksheet.addRows(authors);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=" + "author.xlsx");

  return workbook.xlsx.write(res).then(function () {
    console.log("file saved!");
    res.status(200).end();
  });

  // Write to File
  // workbook.xlsx.writeFile("author.xlsx").then(function () {
  //   console.log("file saved!");
  //   res.json({ msg: "success" });
  //   return;
  // });
});

export const excelBookController = expressAsyncHandler(
  async (req, res, next, error) => {
    try {
      if (req.file == undefined) {
        return res.send({
          success: false,
          message: "👍 Please upload an excel file!!",
        });
        // ("Please upload an excel file!");
      }

      let filePath = req.file.path;
      console.log(filePath);
      // -> Read Excel File to Json Data

      const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [
          {
            // Excel Sheet Name
            name: "Books",
            // Header Row -> be skipped and will not be present at our result object.
            header: {
              rows: 1,
            },
            // Mapping columns to keys
            columnToKey: {
              A: "_id",
              B: "name",
              C: "describe",
              D: "price",
              E: "quantity",
              F: "published",
              G: "img",
              H: "id_category",
              I: "id_author",
              J: "id_nsx",
            },
          },
        ],
      });

      // -> Log Excel Data to Console
      // console.log(excelData);

      function convertToObjectId(id) {
        const id_obj = mongoose.Types.ObjectId(id);
        return id_obj;
      }

      function stringToBoolean(string) {
        switch (string.toLowerCase().trim()) {
          case "true":
          case "yes":
          case "1":
            return true;
          case "false":
          case "no":
          case "0":
          case null:
            return false;
          default:
            return Boolean(string);
        }
      }

      // const id = stringToBoolean(strObj.string);
      // console.log(id);
      // if (typeof id === "boolean") {
      //   // variable is a boolean
      //   console.log(true);
      // }
      // console.log(ObjectId.isValid(id));

      excelData.Books.map((e, i) => {
        // e._id = convertToObjectId(e._id);
        e._id = e._id.slice(1, -1);
        // console.log(e._id);

        // if (typeof e._id === "string") {
        //   console.log("abc");
        // }
        // console.log(typeof e._id);

        // console.log(e.id_category);
        // console.log(mongoose.Types.ObjectId.isValid(e._id));

        e.id_category = convertToObjectId(e.id_category);
        e.id_author = convertToObjectId(e.id_author);
        e.id_nsx = convertToObjectId(e.id_nsx);
        e.published = stringToBoolean(e.published);
      });

      // console.log(excelData);
      // fs.unlinkSync(filePath);
      // return res.json({ success: false, message: "fail" });

      await Book.insertMany(excelData.Books, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          // console.log("Number of documents inserted: " + data);
          res.status(201).json({
            success: true,
            message: "👍 Import thành công!",
          });
        }
      });
      fs.unlinkSync(filePath);

      //   Author.bulkCreate(tutorials)
      //     .then(() => {
      //       res.status(200).send({
      //         message:
      //           "Uploaded the file successfully: " + req.file.originalname,
      //       });
      //     })
      //     .catch((error) => {
      //       res.status(500).send({
      //         message: "Fail to import data into database!",
      //         error: error.message,
      //       });
      //     });
      // });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
      });
    }
  }
);

export const excelDownloadBookController = expressAsyncHandler(
  async (req, res) => {
    const books = await Book.find({}).select(
      "name describe price quantity published img id_category id_author id_nsx "
    );
    // console.log(books);

    let workbook = new excel.Workbook(); //creating workbook
    let worksheet = workbook.addWorksheet("Books"); //creating worksheet

    //  WorkSheet Header
    worksheet.columns = [
      { header: "Id", key: "_id", width: 40 },
      { header: "Name", key: "name", width: 40 },
      { header: "Description", key: "describe", width: 60 },
      { header: "Price", key: "price", width: 10 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Published", key: "published", width: 10 },
      { header: "Image", key: "img", width: 50 },
      { header: "Id Category", key: "id_category", width: 40 },
      { header: "Id Author", key: "id_author", width: 40 },
      { header: "Id Publisher", key: "id_nsx", width: 40 },
    ];

    // Add Array Rows
    worksheet.addRows(books);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + "book.xlsx");

    return workbook.xlsx.write(res).then(function () {
      console.log("File saved!");
      res.status(200).end();
    });
  }
);
