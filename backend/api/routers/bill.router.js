"use strict";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import {
  addBill,
  verifyPayment,
  getBillByIDUser,
  deleteBill,
  deactivateBill,
  deliverBill,
  statisticalTop10,
  statisticaRevenueDay,
  statisticaRevenueMonth,
  statisticaRevenueYear,
  statisticaRevenueQuauter,
  getBillNoVerify,
  getBillVerify,
  countAllProductBill,
  countAllProduct,
  countAllBill,
} from "../controllers/bill.controller.js";
import { requireSignin, adminMiddleware } from "../middleware/index.js";

import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  })
);
// import { transporter } from "../utils/nodemailer.js";
import { payOrderEmailTemplateLogin } from "../utils/utils.js";

import mongoose from "mongoose";
import mongodb from "mongodb";

import Bill from "../models/bill.model.js";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import Cart from "../models/cart.model.js";
import UserAddress from "../models/address.model.js";

const billRouter = express.Router();
billRouter.get(
  "/api/bill",
  expressAsyncHandler(async (req, res) => {
    const { page, size, name } = req.query;
    console.log(name);
    if (name) {
      try {
        const productCategories = await Bill.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$isPaid" },
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
        const productCategories = await Bill.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$isPaid" },
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
billRouter.post("/bill/add", addBill);
billRouter.post(
  "/bill/create",
  requireSignin,
  expressAsyncHandler(async (req, res) => {
    const { products, totalPrice, shippingAddress, paymentMethod } = req.body;

    let cartFind = null;

    if (products.length === 0)
      res.status(400).send({ message: "Cart is empty" });

    try {
      cartFind = await Cart.findOne({ id_user: req.user._id });
      // console.log(cartFind);
    } catch (err) {
      console.log("error ", err);
      res
        .status(500)
        .json({ success: false, message: "👎 Cart không tồn tại!" });
      return;
    }
    if (cartFind === null) {
      res
        .status(404)
        .json({ success: false, message: "👎 Cart không tồn tại!" });
      return;
    }

    // const token = randomstring.generate();
    // let sendEmail = await sendMailConfirmPayment(email, token);
    // if (!sendEmail) {
    //   res
    //     .status(500)
    //     .json({ success: false, message: " 👎 Có lỗi xảy ra khi gửi email!" });
    //   return;
    // }

    const new_bill = new Bill({
      user: req.user._id,
      products: products,
      addressId: shippingAddress,
      // itemsPrice,
      // shippingPrice,
      // taxPrice,
      totalPrice,
      paymentMethod,
    });

    console.log(new_bill);

    try {
      await cartFind.remove();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "👎 Có lỗi xảy ra khi lưu trong database!",
      });
      console.log("Cart remove fail");
      return;
    }

    let createdOrder;

    try {
      createdOrder = await new_bill.save();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "👎 Có lỗi xảy ra khi lưu trong database!",
      });
      console.log("Save bill fail");
      return;
    }

    res.status(201).json({
      success: true,
      message: "👍 Thêm mới thành công!",
      order: createdOrder,
    });
  })
);

billRouter.get(
  "/bill/:id",
  requireSignin,
  expressAsyncHandler(async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    // const { id } = req.params;
    // console.log(mongodb.ObjectID.isValid(id));

    const order = await Bill.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "useraddresses",
          localField: "addressId",
          foreignField: "_id",
          as: "bills",
        },
      },
    ]);
    await Bill.populate(order, {
      path: "user",
      select: { _id: 1, phone_number: 1, firstName: 1 },
    });
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);
billRouter.put(
  "/bill/:id/pay",
  requireSignin,
  expressAsyncHandler(async (req, res) => {
    const orderFind = await Bill.findById(req.params.id).populate(
      "user",
      "email firstName lastName"
    );
    const id = mongoose.Types.ObjectId(req.params.id);
    const order = await Bill.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "useraddresses",
          localField: "addressId",
          foreignField: "_id",
          as: "bills",
        },
      },
    ]);
    await Bill.populate(order, {
      path: "user",
      select: { _id: 1, phone_number: 1, firstName: 1, lastName: 1, email: 1 },
    });
    // console.log(req.body);
    const firstOrder = order[0];
    // const firstAddress = firstOrder.bills[0].address;
    const fullName = orderFind.user.firstName + " " + orderFind.user.lastName;
    // console.log(orderFind);

    if (orderFind) {
      orderFind.isPaid = true;
      orderFind.paidAt = Date.now();
      orderFind.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: orderFind.user.email,
        // email_address: req.body.email_address,
      };
      // const updatedOrder = await orderFind.save();
      let updatedOrder;
      try {
        updatedOrder = await orderFind.save();
      } catch (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
        });
        return;
      }
      console.log(
        "-------------------------------------------------------------------------------------------------------------------------------------"
      );
      console.log(updatedOrder);
      transporter.sendMail(
        {
          from: process.env.EMAIL_FROM,
          to: `${fullName} <${orderFind.user.email}>`,
          // to: orderFind.user.email,
          subject: `New order ${orderFind._id}`,
          html: payOrderEmailTemplateLogin(orderFind, firstOrder.bills[0]),
        },
        (error, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(body);
          }
        }
      );
      // res.json({ msg: "fail" });
      // return;
      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

billRouter.get("/bill/verify/:token", verifyPayment);
billRouter.get("/bill/list/:id_user/:page", requireSignin, getBillByIDUser);
billRouter.get("/bill/delete/:id", requireSignin, deleteBill);
billRouter.get(
  "/bill/deactivate/:id",
  requireSignin,
  adminMiddleware,
  deactivateBill
);
billRouter.put(
  "/bill/deliver/:id",
  requireSignin,
  adminMiddleware,
  deliverBill
);

billRouter.post(
  "/bill/count-all-product-bill",
  requireSignin,
  adminMiddleware,
  countAllProductBill
);
billRouter.post(
  "/bill/count-all-product",
  requireSignin,
  adminMiddleware,
  countAllProduct
);
billRouter.post(
  "/bill/count-all-bill",
  requireSignin,
  adminMiddleware,
  countAllBill
);

billRouter.post("/bill/top/", requireSignin, adminMiddleware, statisticalTop10);
billRouter.post(
  "/api/bills/summary",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    const orders = await Bill.aggregate([
      { $match: { isDelivered: true } },
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await UserAddress.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Bill.aggregate([
      { $match: { isDelivered: true } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Book.aggregate([
      {
        $project: {
          id_category: {
            $toObjectId: "$id_category",
          },
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
          cust_name: "$cate.name",
        },
      },
      {
        $unwind: "$cust_name",
      },
      {
        $group: {
          _id: "$cust_name",
          count: { $sum: 1 },
        },
      },
      // {
      //   $project: {
      //     count: 1,
      //     cust_name: "$cate.name",
      //   },
      // },
    ]);

    res.send({ users, orders, dailyOrders, productCategories });
  })
);
billRouter.post(
  "/bill/statistical/revenue/day",
  requireSignin,
  adminMiddleware,
  statisticaRevenueDay
);
billRouter.post(
  "/bill/statistical/revenue/month",
  requireSignin,
  adminMiddleware,
  statisticaRevenueMonth
);
billRouter.post(
  "/bill/statistical/revenue/year",
  requireSignin,
  adminMiddleware,
  statisticaRevenueYear
);
billRouter.post(
  "/bill/statistical/revenue/quauter",
  requireSignin,
  adminMiddleware,
  statisticaRevenueQuauter
);

billRouter.get(
  "/bill/status/false",
  requireSignin,
  adminMiddleware,
  getBillNoVerify
);
billRouter.get(
  "/bill/status/true",
  requireSignin,
  adminMiddleware,
  getBillVerify
);

billRouter.post(
  "/revenue",
  // requireSignin,
  // adminMiddleware,
  expressAsyncHandler(async (req, res, next) => {
    const today = new Date();
    try {
      let condition = {};

      if (req.query.browse != undefined && req.query.browse != "") {
        switch (req.query.browse) {
          case "day":
            condition.browse = {
              $match: {
                "_id.year": today.getFullYear(),
                "_id.month": today.getMonth() + 1,
                "_id.day": today.getDate(),
              },
            };
            break;
          case "month":
            condition.browse = {
              $match: {
                "_id.year": today.getFullYear(),
                "_id.month": today.getMonth() + 1,
              },
            };
            break;
          case "year":
            condition.browse = {
              $match: {
                "_id.year": today.getFullYear(),
              },
            };
            break;
          default:
            condition.browse = {
              $project: {
                _id: 1,
                totalPrice: 1,
                // total_quantity: 1,
              },
            };
        }
      } else {
        condition.browse = {
          $project: {
            _id: 1,
            totalPrice: 1,
            // total_quantity: 1,
          },
        };
      }

      console.log(condition);

      const pipeline = [
        { $match: { isDelivered: true } },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: "$createdAt" },
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            totalPrice: {
              $sum: `$totalPrice`,
            },
            // total_quantity: {
            //   $sum: `$total_quantity`,
            // },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        condition.browse,
      ];
      const order = await Bill.aggregate(pipeline);

      console.log(order);

      const totalPrice = order.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalPrice,
        0
      );

      // const total_quantity = order.reduce(
      //   (accumulator, currentValue) =>
      //     accumulator + currentValue.total_quantity,
      //   0
      // );

      return res.status(200).json({
        success: true,
        code: 200,
        message: "",
        totalPrice,
        // total_quantity,
        order,
      });
    } catch (error) {
      return next(error);
    }
  })
);

billRouter.post(
  "/session-order",
  // requireSignin,
  // adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    const today = new Date();
    try {
      let condition = {};
      if (req.query.browse != undefined && req.query.browse != "") {
        switch (req.query.browse) {
          case "day":
            condition.browse = {
              $match: {
                "_id.year": today.getFullYear(),
                "_id.month": today.getMonth() + 1,
                "_id.day": today.getDate(),
              },
            };
            break;
          case "month":
            condition.browse = {
              $match: {
                "_id.year": today.getFullYear(),
                "_id.month": today.getMonth() + 1,
              },
            };
            break;
          case "year":
            condition.browse = {
              $match: {
                "_id.year": today.getFullYear(),
              },
            };
            break;
          default:
            condition.browse = {
              $project: {
                _id: 1,
                count: 1,
              },
            };
        }
      } else {
        condition.browse = {
          $project: {
            _id: 1,
            count: 1,
          },
        };
      }
      const pipeline = [
        {
          $group: {
            _id: {
              day: { $dayOfMonth: "$createdAt" },
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            count: {
              $sum: 1,
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        condition.browse,
      ];
      const order = await Bill.aggregate(pipeline);

      console.log(order);
      // console.log(today.getMonth())

      const count = order.reduce(
        (accumulator, currentValue) => accumulator + currentValue.count,
        0
      );

      return res
        .status(200)
        .json({ success: true, code: 200, message: "", count, order });
    } catch (error) {
      return next(error);
    }
  })
);

billRouter.post(
  "/revenue-from-to",
  expressAsyncHandler(async (req, res, next) => {
    try {
      let condition = {};
      if (
        req.query.browse_from != undefined &&
        req.query.browse_from != "" &&
        req.query.browse_to != undefined &&
        req.query.browse_to != ""
      ) {
        condition.browse_from = req.query.browse_from;
        condition.browse_to = req.query.browse_to;
      }
      const pipeline = [
        {
          $match: {
            isDelivered: true,
            createdAt: {
              $lte: new Date(condition.browse_to),
              $gte: new Date(condition.browse_from),
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            totalPrice: {
              $sum: `$totalPrice`,
            },
            // total_quantity: {
            //   $sum: `$total_quantity`,
            // },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ];
      const order = await Bill.aggregate(pipeline);

      console.log(new Date(condition.browse_to));
      console.log(new Date(condition.browse_from));
      console.log(order);

      return res
        .status(200)
        .json({ success: true, code: 200, message: "", order });
    } catch (error) {
      return next(error);
    }
  })
);

export default billRouter;
