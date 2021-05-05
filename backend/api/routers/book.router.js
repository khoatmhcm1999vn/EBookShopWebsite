"use strict";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  getTotalPage,
  getAllBook,
  getBookByPublisher,
  getBookByCategory,
  getBookByAuthor,
  getBookByID,
  getRelatedBook,
} from "../controllers/book.controller.js";
import faker from "faker";
import Book from "../models/book.model.js";

const bookRouter = express.Router();

bookRouter.get("/book/totalpage", getTotalPage);
bookRouter.post("/book/allbook", getAllBook);
// Fake data products
bookRouter.get("/generate-fake-data", async (req, res, next) => {
  for (let i = 0; i < 10; i++) {
    const newprd = new Book();
    newprd.id_category = faker.commerce.productName();
    newprd.id_nsx = faker.commerce.productName();
    newprd.id_author = faker.commerce.productName();
    newprd.name = faker.commerce.productName();
    newprd.price = faker.commerce.price();
    newprd.quantity = faker.commerce.price();
    newprd.published = faker.datatype.boolean();
    newprd.img = faker.image.image();
    newprd.describe = faker.commerce.productName();
    newprd.save((err) => {
      if (err) {
        return next(err);
      }
    });
  }
  res.redirect("/");
});
bookRouter.post(
  "/api/getAllBook",
  expressAsyncHandler(async (req, res) => {
    let count = null;
    try {
      count = await Book.countDocuments();
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err });
      return;
    }
    let perPage = parseInt(req.body.size) || 10; // số lượng sản phẩm xuất hiện trên 1 page
    let totalPage = parseInt((count - 1) / perPage + 1);
    const { name } = req.body;
    let page = parseInt(req.body.page) || 1;
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
      res.status(200).json({ data: [], msg: "Invalid page", totalPage });
      return;
    }
    let bookFind;
    if (name) {
      try {
        console.log(name);
        bookFind = await Book.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$published" },
            },
          },
          {
            $match: {
              name: { $regex: name, $options: "i" },
            },
          },
          {
            $project: {
              id_category: {
                $toObjectId: "$id_category",
              },
              createdAt: 1,
              name: 1,
              describe: 1,
              sales: 1,
              img: 1,
              convertedZipCode: 1,
              price: 1,
              quantity: 1,
              // new_amount: { $add: ["$price", 100] },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "id_category",
              foreignField: "_id",
              as: "cate",
            },
          },
          {
            $project: {
              createdAt: 1,
              name: 1,
              describe: 1,
              sales: 1,
              img: 1,
              convertedZipCode: 1,
              price: 1,
              quantity: 1,
              // new_amount: { $add: ["$price", 100] },
              cate_name: "$cate.name",
            },
          },
          {
            $unwind: "$cate_name",
          },
          { $sort: { createdAt: -1 } },
          // { $skip: perPage * (parseInt(page) - 1) },
          // { $limit: perPage },
        ]);
        res.status(200).json({
          result: "success",
          data: bookFind,
          totalPage,
          pageCurrent: page,
        });
        return;
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
    } else {
      try {
        bookFind = await Book.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$published" },
            },
          },
          {
            $project: {
              id_category: {
                $toObjectId: "$id_category",
              },
              createdAt: 1,
              name: 1,
              describe: 1,
              sales: 1,
              img: 1,
              convertedZipCode: 1,
              price: 1,
              quantity: 1,
              _id: 1,
              id_nsx: 1,
              id_author: 1,
              published: 1,
              // new_amount: { $add: ["$price", 100] },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "id_category",
              foreignField: "_id",
              as: "cate",
            },
          },
          {
            $project: {
              createdAt: 1,
              name: 1,
              describe: 1,
              sales: 1,
              img: 1,
              convertedZipCode: 1,
              price: 1,
              quantity: 1,
              _id: 1,
              id_nsx: 1,
              id_author: 1,
              published: 1,
              // new_amount: { $add: ["$price", 100] },
              cate_name: "$cate.name",
              id_category: "$cate._id",
            },
          },
          {
            $unwind: "$cate_name",
          },
          {
            $unwind: "$id_category",
          },
          // {
          //   $group: {
          //     _id: "$cate_name",
          //     count: { $sum: 1 },
          //     id_book: { $first: "$_id" },
          //     name: { $first: "$name" },
          //     describe: {$first: "$describe"},
          //     describe: {$first: "$describe"},
          //   },
          // },
          // {
          //   $project: {
          //     name: "$name",
          //     count: 1
          //     //  age: "$age",
          //     //  count: "$count",
          //     //  _id:0
          //   },
          // },
          { $sort: { createdAt: -1 } },
          // { $skip: perPage * (parseInt(page) - 1) },
          // { $limit: perPage },
        ]);
        res.status(200).json({
          result: "success",
          data: bookFind,
          totalPage,
          pageCurrent: page,
        });
        return;
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
    }
  })
);
bookRouter.get(
  "/api/product",
  expressAsyncHandler(async (req, res) => {
    const { page, size, name } = req.query;
    console.log(name);
    if (name) {
      try {
        const productCategories = await Book.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$published" },
            },
          },
          {
            $match: {
              name: { $regex: name, $options: "i" },
            },
          },
          {
            $sort: { release_date: -1 },
          },
        ]);
        res.json({ result: "success", data: productCategories });
      } catch (err) {
        res.json({ result: "error", message: err.msg });
      }
    } else {
      console.log("fail");
      try {
        const productCategories = await Book.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$published" },
            },
          },
          {
            $sort: { release_date: -1 },
          },
        ]);
        res.json({ result: "success", data: productCategories });
      } catch (err) {
        res.json({ result: "error", message: err.msg });
      }
    }
  })
);
bookRouter.get(
  "/api/findproduct",
  expressAsyncHandler(async (req, res) => {
    const { page, size, name } = req.query;
    console.log(name);
    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: "i" },
          published: true,
          quantity: { $gte: 1 },
          // published: { $regex: new RegExp(published) },
        }
      : { published: true, quantity: { $gte: 1 } };
    let productCategories;
    try {
      productCategories = await Book.find(
        condition
        // sort: { createdAt: +1 },
      ).sort({ release_date: -1 });
      res.json({ result: "success", data: productCategories });
    } catch (err) {
      res.json({ result: "error", message: err.msg });
    }
  })
);
bookRouter.post("/book/publisher", getBookByPublisher);
bookRouter.post("/book/category", getBookByCategory);
bookRouter.post("/book/author", getBookByAuthor);
bookRouter.get("/book/:id", getBookByID);
bookRouter.get("/book/related/:bookId", getRelatedBook);

export default bookRouter;
