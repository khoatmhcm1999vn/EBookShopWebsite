const User = require("../models/userModel");
const { Order } = require("../models/orderModel");
const { errorHandler } = require("../helpers/dbErrorHandler");
const Product = require("../models/productModel");

const Cart = require("../models/cartModel");

const formidable = require("formidable");
const bcrypt = require("bcrypt");
// const path = require("path");
// const fs = require("fs-extra");

exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    // .populate("roles", "-__v")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found. Please sign in or sign up!",
        });
      }
      req.profile = user;
      next();
    });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  // req.profile.salt = undefined;
  return res.status(201).json(req.profile);
};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to perform this action",
        });
      }
      user.hashed_password = undefined;
      // user.salt = undefined;
      res.status(201).json(user);
    }
  );
};

exports.updateUser = (req, res) => {
  // console.log(
  //   "UPDATE USER - req.profile",
  //   req.profile,
  //   "UPDATE DATA",
  //   req.body
  // );
  const { name, hashed_password } = req.body;

  User.findOne({ _id: req.profile._id })
    // .populate("roles", "-__v")
    .exec(async (err, user) => {
      // console.log(req.profile._id);
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (!name) {
        return res.status(400).json({
          error: "Name is required",
        });
      } else {
        user.name = name;
      }

      // console.log(user);

      if (hashed_password) {
        if (hashed_password.length < 6) {
          return res.status(400).json({
            error: "Password should be min 6 characters long",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          });
        } else {
          const password = await bcrypt.hash(req.body.hashed_password, 10);
          // console.log(password);
          user.hashed_password = password;
        }
      }

      // var authorities = [];
      // var a = {
      //   roles: [],
      // };
      // for (let i = 0; i < user.roles.length; i++) {
      //   authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      // }

      user.save((err, updatedUser) => {
        if (err) {
          console.log("USER UPDATE ERROR", err);
          return res.status(400).json({
            error: "User update failed",
          });
        }
        var userId = updatedUser._id;
        var userName = updatedUser.name;
        var userEmail = updatedUser.email;
        var role = updatedUser.role;
        // console.log(updatedUser);
        // updatedUser.hashed_password = hashed_password;
        // updatedUser.salt = undefined;
        // updatedUser.roles = [authorities];
        // updatedUser.roles = authorities;
        // console.log(updatedUser.role);

        res.status(201).json({
          _id: userId,
          name: userName,
          email: userEmail,
          role: role,
        });
      });
    });
};

exports.abc = async (req, res, next) => {
  var singleOrderx1 = await Cart.findOne(
    { user: req.profile._id },
    (err, order) => {
      // if (err || !user) {
      //   return res.status(400).json({
      //     error: "User not found. Please sign in or sign up!",
      //   });
      // }
      const desx = order;
      // console.log(user.description);
      // next();
      // console.log(des);
      return desx;
    }
  )
    .populate("user", "_id name email")
    .populate("cartItems.product", "_id name description price")
    .then((data) => {
      return data;
    });
  // console.log(singleOrderx1.cartItems);
  var prog = singleOrderx1.cartItems.map((p) => {
    return p;
  });
  next();
};

exports.addOrderToUserHistory = async (req, res, next) => {
  let history = [];

  // console.log(req.body);
  // console.log(req.user);
  // console.log(req.user._id);
  // const singleItem = req.body.items.map((item) => {
  //   return item;
  // });
  // const pId = singleItem.map((i) => {
  //   return i.productId;
  // });
  // const valpId = pId[0];
  // if (typeof valpId === "string" || valpId instanceof String) {
  //   // console.log("true");
  // } else {
  //   console.log("false");
  // }
  // console.log(valpId);
  // var singleProduct = await Product.findById(valpId, (err, product) => {
  //   // if (err || !user) {
  //   //   return res.status(400).json({
  //   //     error: "User not found. Please sign in or sign up!",
  //   //   });
  //   // }
  //   const des = product;
  //   // console.log(user.description);
  //   // next();
  //   // console.log(des);
  //   return des;
  // }).then((data) => {
  //   return data;
  // });
  // console.log(singleProduct);
  // const productx1 = { singleProduct };
  // // console.log(productx1);
  // const des = productx1.singleProduct.description;
  // const name = productx1.singleProduct.name;
  // const category = productx1.singleProduct.category._id;
  // console.log(des);

  // console.log(req.body);

  var singleOrderx1 = await Cart.findOne(
    { user: req.profile._id },
    (err, order) => {
      // if (err || !user) {
      //   return res.status(400).json({
      //     error: "User not found. Please sign in or sign up!",
      //   });
      // }
      const desx = order;
      // console.log(user.description);
      // next();
      // console.log(des);
      return desx;
    }
  )
    .populate("user", "_id name email")
    .populate("cartItems.product", "_id name description price")
    .then((data) => {
      return data;
    });

  // console.log(singleOrderx1.cartItems);

  var prog = singleOrderx1.cartItems.map((p) => {
    return p;
  });
  // console.log(prog);

  // var { prgox } = singleOrderx1.cartItems;
  // console.log(prog);

  // return res.status(401).json("fail");

  prog.forEach((item) => {
    // console.log(item);

    history.push({
      _id: item.product._id,
      name: item.product.name,
      description: item.product.description,
      // category: category,
      quantity: item.count,
      // transaction_id: req.body.order.transaction_id,
      totalAmount: item.product.price,
    });
  });

  // console.log(history);
  // console.log(req.user._id);

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update user purchase history",
        });
      }
      next();
    }
  );
};

exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .populate("items.product", "name")
    .sort("-createdAt")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          // error: 'Could not get the user purchase history'
          error: errorHandler(err),
        });
      }
      res.status(201).json(orders);
    });
};

exports.getProfileById = async (req, res) => {
  let doc = await User.findOne({ _id: req.params.userId });
  res.json(doc);
};

exports.updateProfileX1 = async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let doc = await User.findOneAndUpdate(
        { _id: fields._id },
        { name: fields.name },
        { email: fields.email }
      );
      // await uploadImage(files, fields);
      res.json({ result: "success", message: "Update Successfully", doc });
    });
  } catch (err) {
    res.json({ result: "error", message: err.errmsg });
  }
};
