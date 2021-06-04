"use strict";
import express from "express";
import expressAsyncHandler from "express-async-handler";

import { requireSignin, adminMiddleware } from "../middleware/index.js";

import Book from "../models/book.model.js";
import FlashSale from "../models/flashSales.model.js";
import validator from "../validator/index.js";
import mongoose from "mongoose";

const flashSalesRouter = express.Router();

flashSalesRouter.post(
  "/flash-sales/add/sale",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    if (
      typeof req.body.id_book === "undefined" ||
      typeof req.body.name === "undefined" ||
      typeof req.body.end_date === "undefined" ||
      typeof req.body.salesPercentage === "undefined"
    ) {
      return res.json({
        success: false,
        message: "👎 Dữ liệu nhập vào bị lỗi!",
      });
    }

    let { id_book, name, end_date } = req.body;
    let isEnabled =
      req.body.isEnabled && Boolean(req.body.isEnabled) !== false
        ? Boolean(req.body.isEnabled)
        : false;
    let img =
      req.body.img && String(req.body.img) !== ""
        ? String(req.body.img)
        : "2021-05-07T15-27-20.532Z-khoamk-ThamTuKindaichi-Tap01-Tr000_TSMini.jpg";
    let describe = req.body.describe || "";
    let salesPercentage =
      req.body.salesPercentage && Number(req.body.salesPercentage) !== 0
        ? Number(req.body.salesPercentage)
        : 0;

    // console.log(Array.isArray(id_book));
    console.log(req.body);
    // console.log(id_book);
    // console.log(isEnabled);
    // console.log(img);
    // console.log(describe);
    // console.log(salesPercentage);

    let bookFind;
    try {
      bookFind = await Book.find({ _id: { $in: id_book } });
      // console.log(bookFind);
    } catch (err) {
      return res.json({ success: false, message: "👎 Book không tồn tại!" });
    }

    const newFlash = FlashSale({
      name,
      describe,
      isEnabled,
      img,
      salesPercentage,
      end_date,
      bookId: id_book,
    });

    // console.log(newFlash);
    // await Book.updateMany(
    //   { _id: { $in: id_book } },
    //   { sellPrice: false },
    //   { $set: { published: true } }
    // );
    // await bookFind.save();

    await newFlash.save();
    let bulkOps = bookFind.map((item) => {
      // console.log(item);
      item.sellPrice = item.price * newFlash.salesPercentage;
      console.log(item);
      return {
        updateOne: {
          filter: { _id: item._id },
          update: {
            id_flashSales: newFlash._id,
            sellPrice: item.sellPrice,
          },
        },
      };
    });

    // console.log(bulkOps);
    // bulkOps.map((e) => console.log(e.updateOne.filter));
    // console.log(bookFind);
    // return res.json({
    //   msg: "fail",
    //   data: bookFind,
    //   newFlash
    // });

    await Book.bulkWrite(bulkOps, {}, (error, product) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update the product",
        });
      }
      // console.log(product);
      // next();
    });

    return res
      .status(201)
      .json({ success: true, message: "👍 Thành công!", data: newFlash });
    // console.log(validator.isValidObjId(req.user._id));
    // console.log(mongoose.Types.ObjectId.isValid(req.user._id));
  })
);

flashSalesRouter.post(
  "/flash-sales/get-flash-sale",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    let flashFind;
    try {
      flashFind = await FlashSale.find({}, { __v: 0 }).populate({
        path: "bookId",
        select:
          "_id name img price sellPrice quantity published sales createdAt updatedAt stars reviewCount id_flashSales",
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "👎 FlashSale không tồn tại!",
      });
    }
    res
      .status(200)
      .json({ code: 200, success: true, message: "success", data: flashFind });
  })
);

flashSalesRouter.post(
  "/flash-sales/get-flash-sale/by-id-book",
  expressAsyncHandler(async (req, res) => {
    let { day, month, year } = req.body;
    console.log(new Date(year, month - 1, day));
    console.log(new Date(year, month - 1, parseInt(day) + 1));

    return res.json({ msg: "fail" });
    let flashFind;
    // try {
    //   flashFind = await FlashSale.find(
    //     {
    //       createdAt: {
    //         $gte: new Date(year, month - 1, day),
    //         $lt: new Date(year, month - 1, parseInt(day) + 1),
    //       },
    //     },
    //     { __v: 0 }
    //   ).populate({
    //     path: "bookId",
    //     select:
    //       "_id name img price sellPrice quantity published sales createdAt updatedAt stars reviewCount id_flashSales",
    //   });
    // } catch (err) {
    //   return res.json({
    //     success: false,
    //     message: "👎 FlashSale không tồn tại!",
    //   });
    // }
    // res
    //   .status(200)
    //   .json({ code: 200, success: true, message: "success", data: flashFind });
  })
);

flashSalesRouter.post(
  "/flash-sales/update/sale",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    if (
      typeof req.body.id === "undefined" ||
      typeof req.body.id_book === "undefined" ||
      typeof req.body.name === "undefined" ||
      typeof req.body.end_date === "undefined" ||
      typeof req.body.salesPercentage === "undefined"
    ) {
      return res.json({
        success: false,
        message: "👎 Dữ liệu nhập vào bị lỗi!",
      });
    }

    let { id, id_book, name, end_date } = req.body;
    let isEnabled =
      req.body.isEnabled && Boolean(req.body.isEnabled) !== false
        ? Boolean(req.body.isEnabled)
        : false;
    let img =
      req.body.img && String(req.body.img) !== ""
        ? String(req.body.img)
        : "2021-05-07T15-27-20.532Z-khoamk-ThamTuKindaichi-Tap01-Tr000_TSMini.jpg";
    let describe = req.body.describe || "";
    let salesPercentage =
      req.body.salesPercentage && Number(req.body.salesPercentage) !== 0
        ? Number(req.body.salesPercentage)
        : 0;

    console.log(req.body);

    // console.log(id_book);
    // console.log(isEnabled);
    // console.log(salesPercentage);

    let bookFind;
    try {
      bookFind = await Book.find({ _id: { $in: id_book } });
      // console.log(bookFind);
    } catch (err) {
      return res.json({ success: false, message: "👎 Book không tồn tại!" });
    }

    let flashFind;
    try {
      flashFind = await FlashSale.findOne({ _id: id }, { __v: 0 }).populate({
        path: "bookId",
        select: "_id name price sellPrice",
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "👎 FlashSale không tồn tại!",
      });
    }

    flashFind.name = name;
    flashFind.describe = describe;
    flashFind.isEnabled = isEnabled;
    flashFind.img = img;
    flashFind.salesPercentage = salesPercentage;
    flashFind.end_date = end_date;
    if (id_book.length > 0) flashFind.bookId = id_book;
    // console.log(flashFind);
    await flashFind.save();

    let bulkOps = bookFind.map((item) => {
      // console.log(item);
      item.sellPrice = item.price * flashFind.salesPercentage;
      console.log(item);
      return {
        updateOne: {
          filter: { _id: item._id },
          update: {
            id_flashSales: flashFind._id,
            sellPrice: item.sellPrice,
          },
        },
      };
    });

    // console.log(bulkOps);
    // bulkOps.map((e) => console.log(e.updateOne.filter));
    // console.log(bookFind);
    // return res.json({
    //   msg: "fail",
    //   data: bookFind,
    //   newFlash
    // });

    console.log(isEnabled);
    if (isEnabled === true) {
      await Book.bulkWrite(bulkOps, {}, (error, product) => {
        if (error) {
          return res.status(400).json({
            error: "Could not update the product",
          });
        }
        // console.log(product);
        // next();
      });
    }

    return res
      .status(201)
      .json({ success: true, message: "👍 Thành công!", data: flashFind });
    // console.log(validator.isValidObjId(req.user._id));
    // console.log(mongoose.Types.ObjectId.isValid(req.user._id));
  })
);

flashSalesRouter.post(
  "/flash-sales/update/sale",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    if (
      typeof req.body.id === "undefined" ||
      typeof req.body.id_book === "undefined" ||
      typeof req.body.name === "undefined" ||
      typeof req.body.end_date === "undefined" ||
      typeof req.body.salesPercentage === "undefined"
    ) {
      return res.json({
        success: false,
        message: "👎 Dữ liệu nhập vào bị lỗi!",
      });
    }

    let { id, id_book, name, end_date } = req.body;
    let isEnabled =
      req.body.isEnabled && Boolean(req.body.isEnabled) !== false
        ? Boolean(req.body.isEnabled)
        : false;
    let img =
      req.body.img && String(req.body.img) !== ""
        ? String(req.body.img)
        : "2021-05-07T15-27-20.532Z-khoamk-ThamTuKindaichi-Tap01-Tr000_TSMini.jpg";
    let describe = req.body.describe || "";
    let salesPercentage =
      req.body.salesPercentage && Number(req.body.salesPercentage) !== 0
        ? Number(req.body.salesPercentage)
        : 0;
    console.log(req.body);
    // console.log(id_book);
    // console.log(isEnabled);
    // console.log(salesPercentage);
    let bookFind;
    try {
      bookFind = await Book.find({ _id: { $in: id_book } });
      // console.log(bookFind);
    } catch (err) {
      return res.json({ success: false, message: "👎 Book không tồn tại!" });
    }

    let flashFind;
    try {
      flashFind = await FlashSale.findOne({ _id: id }, { __v: 0 }).populate({
        path: "bookId",
        select: "_id price sellPrice",
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "👎 FlashSale không tồn tại!",
      });
    }
    flashFind.name = name;
    flashFind.describe = describe;
    flashFind.isEnabled = isEnabled;
    flashFind.img = img;
    flashFind.salesPercentage = salesPercentage;
    flashFind.end_date = end_date;
    if (id_book.length > 0) flashFind.bookId = id_book;
    // console.log(flashFind);
    await flashFind.save();

    let bulkOps = bookFind.map((item) => {
      // console.log(item);
      item.sellPrice = item.price * flashFind.salesPercentage;
      console.log(item);
      return {
        updateOne: {
          filter: { _id: item._id },
          update: {
            id_flashSales: flashFind._id,
            sellPrice: item.sellPrice,
          },
        },
      };
    });
    // console.log(bulkOps);
    // bulkOps.map((e) => console.log(e.updateOne.filter));
    // console.log(bookFind);
    // return res.json({
    //   msg: "fail",
    //   data: bookFind,
    //   newFlash
    // });
    console.log(isEnabled);
    if (isEnabled === true) {
      await Book.bulkWrite(bulkOps, {}, (error, product) => {
        if (error) {
          return res.status(400).json({
            error: "Could not update the product",
          });
        }
        // console.log(product);
        // next();
      });
    }

    return res
      .status(201)
      .json({ success: true, message: "👍 Thành công!", data: flashFind });
  })
);

flashSalesRouter.post(
  "/flash-sales/deactivate/sale",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    if (typeof req.body.id === "undefined") {
      return res.json({
        success: false,
        message: "👎 Dữ liệu nhập vào bị lỗi!",
      });
    }
    let { id } = req.body;
    console.log(req.body);

    let flashFind;
    try {
      flashFind = await FlashSale.findOne({ _id: id }, { __v: 0 }).populate({
        path: "bookId",
        select: "_id price sellPrice",
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "👎 FlashSale không tồn tại!",
      });
    }
    const bookFind = flashFind.bookId;
    if (flashFind.isEnabled) flashFind.isEnabled = false;
    else flashFind.isEnabled = true;
    // console.log(flashFind);
    await flashFind.save();

    let bulkOpsActivate = bookFind.map((item) => {
      // console.log(item);
      item.sellPrice = item.price * flashFind.salesPercentage;
      console.log(item);
      return {
        updateOne: {
          filter: { _id: item._id },
          update: {
            // id_flashSales: flashFind._id,
            sellPrice: item.sellPrice,
          },
        },
      };
    });
    let bulkOpsDeactivate = bookFind.map((item) => {
      // console.log(item);
      item.sellPrice = 0;
      console.log(item);
      return {
        updateOne: {
          filter: { _id: item._id },
          update: {
            // id_flashSales: flashFind._id,
            sellPrice: item.sellPrice,
          },
        },
      };
    });
    console.log(flashFind.isEnabled);
    if (flashFind.isEnabled === true) {
      await Book.bulkWrite(bulkOpsActivate, {}, (error, product) => {
        if (error) {
          return res.status(400).json({
            error: "Could not update the product",
          });
        }
      });
    } else {
      await Book.bulkWrite(bulkOpsDeactivate, {}, (error, product) => {
        if (error) {
          return res.status(400).json({
            error: "Could not update the product",
          });
        }
      });
    }

    return res
      .status(201)
      .json({ success: true, message: "👍 Thành công!", data: flashFind });
  })
);
export default flashSalesRouter;
