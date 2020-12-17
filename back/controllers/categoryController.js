// const { validationResult } = require("express-validator");

const { errorHandler } = require("../helpers/dbErrorHandler");
const Category = require("../models/categoryModel");
// const _ = require("lodash");

exports.getCategories = (req, res, next) => {
  // try {
  //   const categories = await Category.find();
  //   res.status(200).json({
  //     message: "Fetched categories successfully.",
  //     categories: categories,
  //   });
  // } catch (err) {
  //   if (!err.statusCode) {
  //     err.statusCode = 500;
  //   }
  //   next(err);
  // }

  Category.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    res.status(200).json({ categories: data });
  });
};

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category)
      return res.status(400).json({ error: "The category does not exist" });
    req.category = category;
    next();
  });
};

exports.getCategoriesX1 = async (req, res) => {
  Category.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    res.status(200).json(data);
  });

  // try {
  //   Category.find({})
  //     .sort({ createdAt: -1 })
  //     .exec((err, data) => {
  //       res.json({
  //         result: "success",
  //         message: "Fetch Categories data Successfully",
  //         data,
  //       });
  //     });
  // } catch (err) {
  //   res.json({ result: "error", message: err.msg });
  // }
};

exports.createCategoryX1 = async (req, res) => {
  try {
    let doc = await Category.create(req.body);

    res.json({
      result: "success",
      message: "Create new Caregory data Successfully",
      doc,
    });
  } catch (err) {
    res.json({ result: "error", message: err.errmsg });
  }
};

exports.getCategoryX1 = async (req, res) => {
  try {
    let data = await Category.findById({ _id: req.params.id });
    res.json({
      result: "success",
      message: "Fetch Single Category data Successfully",
      data: data,
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
};

exports.updateCategoryX1 = async (req, res) => {
  try {
    let doc = await Category.findByIdAndUpdate({ _id: req.body._id }, req.body);

    res.json({
      result: "success",
      message: "Update Category data Successfully",
      doc,
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
};

exports.deleteCategoyX1 = async (req, res) => {
  // console.log(req.params.id);
  try {
    let response = await Category.findOneAndDelete({ _id: req.params.id });

    res.json({
      result: "success",
      message: "Delete Category data Successfully",
      response,
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
};
