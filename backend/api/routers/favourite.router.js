"use strict";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  getFavouriteByIDBook,
  myfavourite,
} from "../controllers/favourite.controller.js";
import { requireSignin } from "../middleware/index.js";
import Favourite from "../models/favourite.model.js";

const favouriteRouter = express.Router();

// favouriteRouter.post("/favourite/addToFavorite", (req, res) => {
//   console.log(req.body);
//   const favorite = new Favorite(req.body);
//   favorite.save((err, doc) => {
//     if (err) return res.json({ success: false, err });
//     return res.status(200).json({ success: true });
//   });
// });
favouriteRouter.post(
  "/favourite/allfavourite",
  requireSignin,
  getFavouriteByIDBook
);
favouriteRouter.post("/favourite/getFavoredBook", (req, res) => {
  // Need to find all of the Users that I am subscribing to From Subscriber Collection
  Favourite.find({ id_user: req.body._id }).exec((err, favorites) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, favorites });
  });
});
favouriteRouter.post("/favourite/addToFavorite", requireSignin, myfavourite);
favouriteRouter.post(
  "/favourite/removeFromFavorite",
  requireSignin,
  (req, res) => {
    Favourite.findOneAndDelete({
      id_book: req.body.id_book,
      id_user: req.body.id_user,
    }).exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, doc });
    });
  }
);

favouriteRouter.post(
  "/favourite/favoriteNumber",
  requireSignin,
  expressAsyncHandler(async (req, res) => {
    if (typeof req.body.id_book === "undefined") {
      res
        .status(422)
        .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
      return;
    }
    let { id_book } = req.body;
    let favFind;
    try {
      favFind = await Favourite.find({
        id_user: req.user._id,
        id_book: id_book,
      });
    } catch (err) {
      res
        .status(422)
        .json({ success: false, message: "👎 Favor không tồn tại!" });
      return;
    }
    res.status(201).json({
      success: true,
      message: "👍 Thành công!",
      subscribeNumber: favFind.length,
    });
  })
);
favouriteRouter.post(
  "/favourite/favorited",
  expressAsyncHandler(async (req, res) => {
    if (
      typeof req.body.id_book === "undefined" ||
      typeof req.body.id_user === "undefined"
    ) {
      res
        .status(422)
        .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
      return;
    }
    let { id_book, id_user } = req.body;
    let favFind;
    let result = false;
    try {
      favFind = await Favourite.find({ id_book: id_book, id_user: id_user });
      if (favFind.length !== 0) {
        result = true;
      }
    } catch (err) {
      res
        .status(422)
        .json({ success: false, message: "👎 Favor không tồn tại!" });
      return;
    }
    res.status(201).json({
      success: true,
      message: "👍 Thành công!",
      subcribed: result,
    });
  })
);

export default favouriteRouter;
