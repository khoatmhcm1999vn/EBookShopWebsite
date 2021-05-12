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
import Bill from "../models/bill.model.js";

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
          // pageCurrent: page,
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
            $sort: { createdAt: -1 },
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
            $sort: { createdAt: -1 },
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
      ).sort({ createdAt: -1 });
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

bookRouter.post(
  "/get/best-seller",
  expressAsyncHandler(async (req, res) => {
    const pipeline = [
      // {
      //   $project: {
      //     _id: {
      //       $toObjectId: "$products._id",
      //     },
      //   },
      // },
      {
        $unwind: "$products", // lấy ra param order_list[] chia đều thành mảng các object
      },
      { $project: { products: 1 } }, // chỉ hiển thị field order_list
      {
        $group: {
          _id: "$products._id",
          name: { $first: "$products.name" },
          price: { $first: "$products.price" },
          count: { $sum: 1 },
        },
      },
      // {
      //   $project: {
      //     name: 1,
      //     count: 1,
      //   },
      // },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ];
    const order = await Bill.aggregate(pipeline);
    // await Product.populate(order, {
    //   path: "_id",
    //   select: [
    //     "name",
    //     "bigimage",
    //     "stars",
    //     "price_min",
    //     "reviewCount",
    //     "pathseo",
    //     "active",
    //   ],
    //   populate: { path: "bigimage", select: "public_url" },
    // });
    return res.status(200).json({ success: true, code: 200, products: order });
  })
);

bookRouter.post(
  "/api/get-newest-product",
  expressAsyncHandler(async (req, res) => {
    let products = await Book.find(
      { published: true },
      {
        name: 1,
        price: 1,
        img: 1,
        quantity: 1,
        describe: 1,
        // group: 0,
        // category: 0,
        // brand: 0,
        createdAt: 1,
        // updatedAt: 0,
        // price_max: 0,
      }
    )
      // .populate({ path: "bigimage", select: "public_url" })
      .limit(2)
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, code: 200, products });
  })
);

bookRouter.post(
  "/api/get-favor-product",
  expressAsyncHandler(async (req, res) => {
    const pipeline = [
      {
        $sort: { stars: -1 },
      },
      {
        $limit: 2,
      },
      {
        $project: {
          name: 1,
          img: 1,
          stars: 1,
          price: 1,
          reviewCount: 1,
          published: 1,
        },
      },
    ];
    const products = await Book.aggregate(pipeline);
    // await Image.populate(products, {path: "bigimage", select: 'public_url'})
    return res.status(200).json({ success: true, code: 200, products });
  })
);

export default bookRouter;
