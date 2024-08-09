"use strict";
import express from "express";
import Rating from "../models/rating.model.js";
import expressAsyncHandler from "express-async-handler";

const ratingRouter = express.Router();

ratingRouter.post(
  "/rating/addrating",
  expressAsyncHandler(async (req, res) => {
    // if (typeof req.body.name === "undefined") {
    //   res
    //     .status(422)
    //     .json({ success: false, message: " 👎 Dữ liệu nhập vào bị lỗi!" });
    //   return;
    // }

    let { value } = req.body;
    let ratingFind;

    try {
      ratingFind = await Rating.find({ value });
    } catch (err) {
      res.json({ success: false, message: "👎 Rating đã tồn tại!" });
      return;
    }

    if (ratingFind.length > 0) {
      res.json({ success: false, message: "👎 Rating đã tồn tại!" });
      return;
    }

    const newRating = new Rating({ value });

    try {
      await newRating.save();
    } catch (err) {
      //console.log(err);
      res.json({
        success: false,
        message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
      });
      return;
    }

    res.status(201).json({ success: true, message: "👍 Thêm mới thành công!" });
  })
);

export default ratingRouter;
