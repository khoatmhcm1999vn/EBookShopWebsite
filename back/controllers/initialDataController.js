const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

exports.initialData = async (req, res) => {
  const categories = await Category.find({}).exec();
  const products = await Product.find({})
    .select("_id name price quantity description imageUrl category")
    .populate({ path: "category", select: "_id name" })
    .exec();
  const orders = await Order.Order.find({})
    .populate("items.product", "name")
    .exec();
  res.status(200).json({
    categories,
    products,
    orders,
  });
};
