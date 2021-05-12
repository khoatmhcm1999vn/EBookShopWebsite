"use strict";
import Cart from "../models/cart.model.js";

export const addToCart = async (req, res) => {
  if (
    typeof req.body.id_user === "undefined" ||
    typeof req.body.products === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  const { id_user, products } = req.body;
  let cartFind;
  try {
    cartFind = await Cart.findOne({ id_user: id_user });
  } catch (err) {
    // const cart_new = new cart({
    //   id_user: id_user,
    //   products: products,
    // });
    // let cartsave;
    // try {
    //   cartsave = await cart_new.save();
    // } catch (err) {
    //   res.status(500).json({
    //     success: false,
    //     message: "👎 Có lỗi xảy ra khi lưu vào trong database!",
    //   });
    //   return;
    // }
    // return;
  }
  if (cartFind === null) {
    const cart_new = new Cart({
      id_user: id_user,
      products: products,
    });
    let cartsave;
    try {
      cartsave = await cart_new.save();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "👎 Có lỗi xảy ra khi lưu vào trong database!",
      });
      return;
    }
    return;
  }
  for (let i = 0; i < products.length; i++) {
    let index = cartFind.products.findIndex(
      (element) => products[i]._id === element._id
    );
    if (index === -1) {
      cartFind.products.push(products[i]);
    } else {
      cartFind.products[index].count += Number(products[i].count);
    }
  }

  try {
    await Cart.findByIdAndUpdate(cartFind._id, {
      $set: { products: cartFind.products },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "👎 Có lỗi xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res
    .status(200)
    .json({ success: true, message: "👍 Thêm vào giỏ hàng thành công!" });
};

export const getAll = async (req, res) => {
  if (typeof req.params.id_user === "undefined") {
    res.status(422).json({ msg: "invalid data" });
    return;
  }
  Cart.findOne({ id_user: req.params.id_user }, (err, docs) => {
    if (err) {
      res.status(500).json({ msg: err });
      return;
    }
    res.status(200).json({ data: docs });
  });
};

export const update = async (req, res) => {
  if (
    typeof req.body.id_user === "undefined" ||
    typeof req.body.product === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  const { id_user, product } = req.body;
  let cartFind = null;
  try {
    cartFind = await Cart.findOne({ id_user: id_user });
  } catch (err) {
    res.status(500).json({ success: false, message: "👎 Cart không tồn tại!" });
    return;
  }
  if (cartFind === null) {
    res.status(404).json({ success: false, message: "👎 Cart không tồn tại!" });
    return;
  }
  let index = cartFind.products.findIndex(
    (element) => element._id === product._id
  );
  if (index === -1) {
    res
      .status(404)
      .json({ success: false, message: "👎 Product không tồn tại!" });
    return;
  }
  cartFind.products[index].count = Number(product.count);
  try {
    await Cart.findByIdAndUpdate(cartFind._id, {
      $set: { products: cartFind.products },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "👎 Có lỗi xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res.status(200).json({ success: true, message: "👍 Cập nhật thành công!" });
};

export const deleteCart = async (req, res) => {
  if (
    typeof req.body.id_user === "undefined" ||
    typeof req.body.id_product === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  const { id_user, id_product } = req.body;
  let cartFind = null;
  try {
    cartFind = await Cart.findOne({ id_user: id_user });
  } catch (err) {
    res.status(500).json({ success: false, message: "👎 Cart không tồn tại!" });
    return;
  }
  if (cartFind === null) {
    res.status(404).json({ success: false, message: "👎 Cart không tồn tại!" });
    return;
  }
  let index = cartFind.products.findIndex(
    (element) => element._id === id_product
  );
  if (index === -1) {
    res
      .status(404)
      .json({ success: false, message: "👎 Product không tồn tại!" });
    return;
  }
  cartFind.products.splice(index, 1);
  try {
    await Cart.findByIdAndUpdate(cartFind._id, {
      $set: { products: cartFind.products },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "👎 Có lỗi xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res.status(200).json({ success: true, message: "👍 Xóa thành công!" });
};

export const removeCartByIDUser = async (id_user) => {
  try {
    cartFind = await Cart.findOne({ id_user: id_user });
  } catch (err) {
    console.log(err);
    return false;
  }
  try {
    await cartFind.remove();
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
