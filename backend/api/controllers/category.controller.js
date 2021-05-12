"use strict";
import Category from "../models/category.model.js";

export const getCategory = (req, res) => {
  Category.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({ data: docs });
  });
};

export const getCategoryUser = (req, res) => {
  Category.find({ isEnabled: true }, (err, docs) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({ data: docs });
  });
};

export const getAll = async (req, res) => {
  if (typeof req.params.page === "undefined") {
    res.status(402).json({ msg: "Data invalid" });
    return;
  }
  let count = null;
  try {
    count = await Category.count({});
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
  Category.find({})
    .skip(9 * (parseInt(page) - 1))
    .limit(9)
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
      res.status(200).json({ data: docs, totalPage });
    });
};

export const getNameByCategoryID = async (req, res) => {
  if (req.params.id === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let result;
  try {
    result = await Category.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
  if (result === null) {
    res.status(404).json({ msg: "not found" });
    return;
  }
  res.status(200).json({ name: result.name });
};

export const getCategoryIDBySearchText = async (searchText) => {
  let arr = [];
  try {
    arr = await Category.find(
      { name: new RegExp(searchText, "i") },
      { name: 0 }
    );
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  return arr.map((i) => i.id);
};
