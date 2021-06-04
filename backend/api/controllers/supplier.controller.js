"use strict";
import Supplier from "../models/supplier.model.js";

export const getSupplier = (req, res) => {
  Supplier.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json({ data: docs });
  });
};

export const getSupplierUser = (req, res) => {
  Supplier.find({ isEnabled: true }, (err, docs) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json({ data: docs });
  });
};

export const getAll = async (req, res) => {
  if (typeof req.params.page === "undefined") {
    return res.status(402).json({ msg: "Data invalid" });
  }
  let count = null;
  try {
    count = await Supplier.count({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err });
  }
  let totalPage = parseInt((count - 1) / 9 + 1);
  let { page } = req.params;
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    return res.status(200).json({ data: [], msg: "Invalid page", totalPage });
  }
  Supplier.find({})
    .skip(9 * (parseInt(page) - 1))
    .limit(9)
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
      }
      return res.status(200).json({ data: docs, totalPage });
    });
};

export const getNameBySupplierID = async (req, res) => {
  if (req.params.id === "undefined") {
    return res.status(422).json({ msg: "Invalid data" });
  }
  let result;
  try {
    result = await Supplier.findById(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err });
  }
  if (result === null) {
    return res.status(404).json({ msg: "not found" });
  }
  return res.status(200).json({ name: result.name });
};

export const getSupplierIDBySearchText = async (searchText) => {
  let arr = [];
  try {
    arr = await Supplier.find(
      { name: new RegExp(searchText, "i") },
      { name: 0 }
    );
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
  return arr.map((i) => i.id);
};
