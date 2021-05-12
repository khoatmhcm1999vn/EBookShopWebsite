"use strict";
import Book from "../models/book.model.js";

import { getPublisherIDBySearchText } from "../controllers/publisher.controller.js";
import { getAuthorIDBySearchText } from "../controllers/author.controller.js";
import { getCategoryIDBySearchText } from "../controllers/category.controller.js";

export const getTotalPage = (req, res) => {
  Book.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: err });
      return;
    }
    res.status(200).json({ data: parseInt((docs.length - 1) / 9) + 1 });
  });
};

export const getAllBook = async (req, res) => {
  if (typeof req.body.page === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  // Khoang gia
  let range = null;
  let objRange = null;
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    // objRange = JSON.parse(range);
    objRange = range;
  }
  // Search Text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  let searchPublisher = null;
  searchPublisher = await getPublisherIDBySearchText(searchText);
  // console.log(searchPublisher)
  let searchAuthor = null;
  searchAuthor = await getAuthorIDBySearchText(searchText);
  let searchCategory = null;
  searchCategory = await getCategoryIDBySearchText(searchText);
  // Sap xep
  let sortType = "createdAt";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "createdAt" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  // Trang va tong so trang
  let bookCount = null;
  try {
    if (range !== null) {
      bookCount = await Book.count({
        $or: [
          { name: new RegExp(searchText, "i") },
          { id_nsx: { $in: searchPublisher } },
          { id_author: { $in: searchAuthor } },
          { id_category: { $in: searchCategory } },
        ],
        price: { $gte: objRange.low, $lte: objRange.high },
        published: true,
      });
    } else {
      bookCount = await Book.count({
        $or: [
          { name: new RegExp(searchText, "i") },
          { id_nsx: { $in: searchPublisher } },
          { id_author: { $in: searchAuthor } },
          { id_category: { $in: searchCategory } },
        ],
        published: true,
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = parseInt((bookCount - 1) / 9 + 1);
  let { page } = req.body;
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  // De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  // console.log(sortQuery);
  // Lay du lieu
  if (range !== null) {
    Book.find({
      $or: [
        { name: new RegExp(searchText, "i") },
        { id_nsx: { $in: searchPublisher } },
        { id_author: { $in: searchAuthor } },
        { id_category: { $in: searchCategory } },
      ],
      price: { $gte: objRange.low, $lte: objRange.high },
      published: true,
    })

      // select('-_id');

      .select(
        "id_category id_nsx id_author name img price quantity published sales view_counts createdAt"
      )
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage });
      });
  } else {
    Book.find({
      $or: [
        { name: new RegExp(searchText, "i") },
        { id_nsx: { $in: searchPublisher } },
        { id_author: { $in: searchAuthor } },
        { id_category: { $in: searchCategory } },
      ],
      published: true,
    })
      .select(
        "id_category id_nsx id_author name img price quantity published sales view_counts createdAt"
      )
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage });
      });
  }
};

export const getBookByPublisher = async (req, res) => {
  if (
    typeof req.body.page === "undefined" ||
    typeof req.body.id === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id, page } = req.body;
  //Khoang gia
  let range = null;
  let objRange = null;
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    //objRange = JSON.parse(range);
    objRange = range;
  }
  //Search Text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  //Sap xep
  let sortType = "createdAt";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "createdAt" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //Trang va tong so trang
  let bookCount = null;
  try {
    if (range !== null) {
      bookCount = await Book.count({
        name: new RegExp(searchText, "i"),
        id_nsx: id,
        price: { $gte: objRange.low, $lte: objRange.high },
        published: true,
      });
    } else {
      bookCount = await Book.count({
        name: new RegExp(searchText, "i"),
        id_nsx: id,
        published: true,
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = parseInt((bookCount - 1) / 9 + 1);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Lay du lieu
  if (range !== null) {
    Book.find({
      name: new RegExp(searchText, "i"),
      id_nsx: id,
      price: { $gte: objRange.low, $lte: objRange.high },
      published: true,
    })
      .select(
        "id_category id_nsx id_author name img price quantity published sales view_counts createdAt"
      )
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage });
      });
  } else {
    Book.find({
      name: new RegExp(searchText, "i"),
      id_nsx: id,
      published: true,
    })
      .select(
        "id_category id_nsx id_author name img price quantity published sales view_counts createdAt"
      )
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage });
      });
  }
};

export const getBookByCategory = async (req, res) => {
  if (
    typeof req.body.id === "undefined" ||
    typeof req.body.page === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id, page } = req.body;
  //Khoang gia
  let range = null;
  let objRange = null;
  // console.log(req.body.range);
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    objRange = range;
  }
  //Kiem tra text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  //Sap xep
  let sortType = "createdAt";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "createdAt" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //Tinh tong so trang
  let bookCount, bookFind;
  try {
    if (range === null) {
      bookFind = await Book.find({
        id_category: id,
        name: new RegExp(searchText, "i"),
        published: true,
      });
    } else {
      bookFind = await Book.find({
        id_category: id,
        name: new RegExp(searchText, "i"),
        price: { $gte: objRange.low, $lte: objRange.high },
        published: true,
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  bookCount = bookFind.length;
  let totalPage = parseInt((bookCount - 1) / 9 + 1);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res
      .status(200)
      .json({ data: [], msg: "Invalid page", totalPage: totalPage });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Lay du lieu
  if (range === null) {
    Book.find({
      id_category: id,
      name: new RegExp(searchText, "i"),
      published: true,
    })
      .select(
        "id_category id_nsx id_author name img price quantity published sales view_counts createdAt"
      )
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage: totalPage });
      });
  } else {
    Book.find({
      id_category: id,
      name: new RegExp(searchText, "i"),
      price: { $gte: objRange.low, $lte: objRange.high },
      published: true,
    })
      .select(
        "id_category id_nsx id_author name img price quantity published sales view_counts createdAt"
      )
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage: totalPage });
      });
  }
};

export const getBookByAuthor = async (req, res) => {
  if (
    typeof req.body.id === "undefined" ||
    typeof req.body.page === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id, page } = req.body;
  //Khoang gia
  let range = null;
  let objRange = null;
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    objRange = range;
  }
  //Kiem tra text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  //Sap xep
  let sortType = "createdAt";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "createdAt" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Tinh tong so trang
  let bookCount, bookFind;
  try {
    if (range === null) {
      bookFind = await Book.find({
        id_author: id,
        name: new RegExp(searchText, "i"),
        published: true,
      });
    } else {
      bookFind = await Book.find({
        id_author: id,
        name: new RegExp(searchText, "i"),
        price: { $gte: objRange.low, $lte: objRange.high },
        published: true,
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  bookCount = bookFind.length;
  let totalPage = parseInt((bookCount - 1) / 9 + 1);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res
      .status(200)
      .json({ data: [], msg: "Invalid page", totalPage: totalPage });
    return;
  }
  //Lay du lieu
  if (typeof req.body.range === "undefined") {
    Book.find({
      id_author: id,
      name: new RegExp(searchText, "i"),
      published: true,
    })
      .select(
        "id_category id_nsx id_author name img price quantity published sales view_counts createdAt"
      )
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage: totalPage });
      });
  } else {
    Book.find({
      id_author: id,
      name: new RegExp(searchText, "i"),
      price: { $gte: objRange.low, $lte: objRange.high },
      published: true,
    })
      .select(
        "id_category id_nsx id_author name img price quantity published sales view_counts createdAt"
      )
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage: totalPage });
      });
  }
};

export const getBookByID = async (req, res) => {
  if (req.params.id === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let result;
  try {
    result = await Book.findById(req.params.id, {
      // __v: 0,
      name: 1,
      id_category: 1,
      id_author: 1,
      id_nsx: 1,
      img: 1,
      price: 1,
      quantity: 1,
      published: 1,
      reviewCount: 1,
      stars: 1,
      view_counts: 1,
      createdAt: 1,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
  if (result === null) {
    res.status(404).json({ msg: "not found" });
    return;
  }
  result.view_counts = result.view_counts + 1;
  result.save((err, docs) => {
    if (err) {
      console.log(err);
    }
  });
  res.status(200).json({ data: result });
};

export const getRelatedBook = async (req, res) => {
  if (typeof req.params.bookId === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { bookId } = req.params;
  let bookObj = null;
  try {
    bookObj = await Book.findById(bookId);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
  if (bookObj === null) {
    res.status(200).json({ data: [], msg: "Invalid bookId" });
    return;
  }
  Book.find(
    {
      $or: [
        {
          $and: [
            { id_category: bookObj.id_category },
            { _id: { $nin: [bookId] } },
            { published: true },
          ],
        },
        {
          $and: [
            { id_author: bookObj.id_author },
            { _id: { $nin: [bookId] } },
            { published: true },
          ],
        },
      ],
    },
    {
      name: 1,
      id_category: 1,
      id_author: 1,
      id_nsx: 1,
      img: 1,
      price: 1,
      quantity: 1,
      published: 1,
      stars: 1,
      view_counts: 1,
      createdAt: 1,
    }
  )
    // .select("-__v name ")
    .limit(5)
    .sort({ createdAt: -1 })
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
      res.status(200).json({ data: docs });
    });
};
