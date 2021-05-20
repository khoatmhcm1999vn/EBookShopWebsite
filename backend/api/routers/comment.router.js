"use strict";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  mycomment,
  getCommentByIDBook,
} from "../controllers/comment.controller.js";
import { requireSignin } from "../middleware/index.js";
import Book from "../models/book.model.js";
import Point from "../models/pointBook.model.js";
// import validator from "../validator/index.js";
// import mongoose from "mongoose";

const commentRouter = express.Router();

commentRouter.post("/comment", requireSignin, mycomment);
commentRouter.post("/comment/book", getCommentByIDBook);

commentRouter.post(
  "/point/add/book",
  requireSignin,
  expressAsyncHandler(async (req, res) => {
    if (typeof req.body.id_book === "undefined") {
      return res.json({
        success: false,
        message: "👎 Dữ liệu nhập vào bị lỗi!",
      });
    }

    let { id_book } = req.body;
    let bookFind;
    try {
      bookFind = await Book.findById(id_book);
    } catch (err) {
      return res.json({ success: false, message: "👎 Book không tồn tại!" });
    }

    let pointFind;
    try {
      pointFind = await Point.findOne({ user: req.user._id, book: id_book });
    } catch (err) {
      // return res.json({ success: false, message: "👎 Point không tồn tại!" });
      console.log(err);
    }

    if (pointFind === null || pointFind === "undefined") {
      const newPoint = Point({
        user: req.user._id,
        book: id_book,
      });

      await newPoint.save();
      bookFind.view_counts = bookFind.view_counts + 1;
      await bookFind.save();

      return res
        .status(201)
        .json({ success: true, message: "👍 Bình chọn thành công!" });
    } else {
      return res.json({
        success: false,
        message: "👎 Bạn đã bình chọn!",
      });
    }
    // console.log(validator.isValidObjId(req.user._id));
    // console.log(mongoose.Types.ObjectId.isValid(req.user._id));
  })
);

commentRouter.post(
  "/point/remove/book",
  requireSignin,
  expressAsyncHandler(async (req, res) => {
    Point.findOneAndDelete({
      user: req.user._id,
      book: req.body.id_book,
    }).exec(async (err, doc) => {
      if (err) return res.json({ success: false, err });

      let bookFind;
      try {
        bookFind = await Book.findById(req.body.id_book);
      } catch (err) {
        return res.json({ success: false, message: "👎 Book không tồn tại!" });
      }

      bookFind.view_counts = bookFind.view_counts - 1;
      await bookFind.save();

      res.status(200).json({ success: true, doc });
    });
  })
);

commentRouter.post(
  "/point/pointNumber",
  requireSignin,
  expressAsyncHandler(async (req, res) => {
    if (typeof req.body.id_book === "undefined") {
      return res.json({
        success: false,
        message: "👎 Dữ liệu nhập vào bị lỗi!",
      });
    }

    let { id_book } = req.body;
    let pointFind;
    try {
      pointFind = await Point.find({
        user: req.user._id,
        book: id_book,
      });
    } catch (err) {
      return res.json({ success: false, message: "👎 Point không tồn tại!" });
    }

    res.status(201).json({
      success: true,
      message: "👍 Thành công!",
      subscribeNumber: pointFind.length,
    });
  })
);

commentRouter.post(
  "/point/pointed",
  expressAsyncHandler(async (req, res) => {
    if (
      typeof req.body.id_book === "undefined" ||
      typeof req.body.id_user === "undefined"
    ) {
      return res.json({
        success: false,
        message: "👎 Dữ liệu nhập vào bị lỗi!",
      });
    }

    let { id_book, id_user } = req.body;
    let pointFind;
    let result = false;
    try {
      pointFind = await Point.find({ user: id_user, book: id_book });
      if (pointFind.length !== 0) {
        result = true;
      }
    } catch (err) {
      return res.json({ success: false, message: "👎 Point không tồn tại!" });
    }

    res.status(201).json({
      success: true,
      message: "👍 Thành công!",
      subcribed: result,
    });
  })
);

export default commentRouter;
