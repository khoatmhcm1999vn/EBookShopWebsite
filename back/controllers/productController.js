const fs = require("fs");
const path = require("path");

const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

// const Category = require("../models/categoryModel");

const { errorHandler } = require("../helpers/dbErrorHandler");

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.getAllProductPublished = (req, res) => {
  var query = {};
  if (req.body.customerName) {
    query = { published: true };
  }

  Product.find({ published: true }, function (err, data) {
    if (err) {
      // return error
    }
    //return data
    // console.log(data);
    res.status(201).json(data);
  });
};

exports.getAllProductPublishedX1 = (req, res) => {
  var query = {};

  const { page, size, name } = req.query;
  var condition = name
    ? {
        name: { $regex: new RegExp(name), $options: "i" },
        published: true,
        // published: { $regex: new RegExp(published) },
      }
    : { published: true };

  const { limit, offset } = getPagination(page, size);

  const options = {
    populate: "category",
    published: true,
    offset: offset,
    limit: limit,
  };
  if (req.body.customerName) {
    query = { published: true };
  }

  Product.find({ published: true }, function (err, data) {
    if (err) {
      // return error
    }
    //return data
    // console
    //   .log(data)
    Product.paginate(condition, options).then((data) => {
      return res.status(201).json({
        totalItems: data.totalDocs,
        products: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    });

    // res.status(201).json(data);
  });
};

// Retrieve all Products from the database.
// exports.findAll = (req, res) => {
//   const { page, size, name } = req.query;
//   var condition = name
//     ? {
//         name: { $regex: new RegExp(name), $options: "i" },
//         // published: { $regex: new RegExp(published) },
//       }
//     : {};

//   const { limit, offset } = getPagination(page, size);

//   const options = {
//     populate: "category",
//     published: true,
//     offset: offset,
//     limit: limit,
//   };

//   Product.paginate(condition, options)
//     .then((data) => {
//       return res.status(201).json({
//         totalItems: data.totalDocs,
//         products: data.docs,
//         totalPages: data.totalPages,
//         currentPage: data.page - 1,
//       });
//     })
//     // .then(
//     // Product.find({ published: true })
//     //   .then((data) => {
//     //     Product.paginate(condition, options).then((datax1) => {
//     //       return res.status(201).json({
//     //         totalItems: datax1.totalDocs,
//     //         products: data,
//     //         totalPages: datax1.totalPages,
//     //         currentPage: datax1.page - 1,
//     //       });
//     //     });
//     //   })
//     .catch((err) => {
//       res.status(500).json({
//         message:
//           err.message || "Some error occurred while retrieving products.",
//       });
//     });
// };

// Find all published Products
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Product.find()
    .populate("category")
    .paginate({ published: true }, { offset, limit })
    .populate("category")
    .exec(err, (data) => {})
    .then((data) => {
      res.status(201).send({
        totalItems: data.totalDocs,
        products: data.docs,
        category: data.categories,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    });
};

exports.getProducts = async (req, res, next) => {
  const currentPage = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.limit) || 3;
  let totalItems;
  try {
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .populate("category")
      // .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Fetched products successfully.",
      products: products,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      // return res.status(400).json({ error: errorHandler(err) });
    }
    next(err);
  }

  // .catch((err) => {
  //   if (!err.statusCode) {
  //     err.statusCode = 500;
  //   }
  //   next(err);
  // });
};

// Middlewares
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product)
        return res.status(400).json({ error: "The product does not exist" });
      req.product = product;
      next();
    });
};

exports.read = (req, res) => {
  // req.product.photo = undefined;
  return res.status(201).json(req.product);
};

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 12;

  Product.find({ published: true })
    // .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, product) => {
      if (err)
        return res.status(400).json({ error: "The product does not exist" });
      res.status(201).json(product);
    });
};

// list all other products that in the same categories
// it will find the products based on the req product category
// other products that has the same category, will be returned
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({
    _id: { $ne: req.product },
    category: req.product.category,
    published: true,
  })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.status(201).json(products);
    });
};

// list all categories that the product belongs to
exports.listCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) return res.status(400).json({ error: "The categories not found" });
    res.status(201).json(categories);
  });
};

/*
list products by search
we will implement product search in react frontend
we will show categories in checkbox and price range in radio buttons
an api request as the user clicks on those checkbox and radio buttons
we will make api request and show the products to users based on what he wants
*/
exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = { published: true };

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  // { category: [ '5e28f40052bf23398431bd17', ... ], price: { '$gte': 0, '$lte': 9 } }
  console.log("findArgs", findArgs);

  Product.find(findArgs)
    // .select("-imageUrl")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.status(201).json({
        size: data.length,
        data,
      });
    });
};

exports.listSearch = (req, res) => {
  const query = {};
  // create query object to hold search value and category value
  // assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    query.published = true;
    // assign category value to query.category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
    // find the product based on query object with 2 properties
    // search and category
    // find the product based on query {name:value, category:id}
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.status(201).json(products);
    }).populate("category");
    // .select("-imageUrl");
  }
};

// https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
// https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/
exports.decreaseQuantity = async (req, res, next) => {
  // const { items } = req.body;

  // const singleItem = items.map((item) => {
  //   return item.product;
  // });

  // // console.log(items);
  // // console.log(req.body.items);

  // req.body.items.map((i) => {
  //   console.log(i.product);
  // });

  // const testArx = req.body.items.map((i) => {
  //   return i;
  // });

  // console.log(testArx);

  // const singleQuant = items.map((item) => {
  //   return item.purchasedQty;
  // });

  // const pId = singleItem.map((i) => {
  //   return i.productId;
  // });
  // const valpId = pId[0];
  // console.log(singleItem);
  // if (typeof valpId === "string" || valpId instanceof String) {
  //   // console.log("true");
  // } else {
  //   console.log("false");
  // }
  // console.log(valpId);

  // const valpId = singleItem;
  // var arrayP = await Product.find(
  //   {
  //     _id: { $in: valpId },
  //   },
  //   (err, docs) => {
  //     const pro = docs;
  //     return pro;
  //   }
  // ).then((data) => {
  //   return data;
  // });
  // // console.log(arrayP);
  // const counts = arrayP.map((c) => {
  //   return c.quantity;
  // });
  // const vCounts = counts;
  // // console.log(singleItem);
  // // console.log(singleQuant);
  // // console.log(vCounts);

  // const arr1 = [0, 1, 2];
  // arr1.forEach((i) => {
  //   if (i > 0) {
  //     return true;
  //   } else {
  //     // console.log("fail");
  //   }
  // });
  // console.log(arr1);

  // var singleProduct = await Product.find({ valpId }, (err, product) => {
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
  // console.log(productx1);
  // const proId = productx1.singleProduct._id;
  // const pub = productx1.singleProduct.published;
  // const count = productx1.singleProduct.quantity;
  // const category = productx1.singleProduct.category._id;
  // console.log(pub);
  // console.log(count);
  // console.log(req.profile._id);

  // return res.status(401).json("fail");
  // const singleItem = items.map((item) => {
  //   return item.product;
  // });

  // const singleQuant = items.map((item) => {
  //   return item.purchasedQty;
  // });

  // const pId = singleItem.map((i) => {
  //   return i.productId;
  // });
  // const valpId = pId[0];
  // console.log(singleItem);
  // if (typeof valpId === "string" || valpId instanceof String) {
  //   // console.log("true");
  // } else {
  //   console.log("false");
  // }
  // console.log(valpId);

  // const valpId = singleItem;
  // var arrayP = await Product.find(
  //   {
  //     _id: { $in: valpId },
  //   },
  //   (err, docs) => {
  //     const pro = docs;
  //     return pro;
  //   }
  // ).then((data) => {
  //   return data;
  // });
  // console.log(arrayP);
  // const counts = arrayP.map((c) => {
  //   return c.quantity;
  // });

  let bulkOps = req.body.items.map((item) => {
    // console.log(item);
    // console.log(item.product);
    // console.log(singleItem);
    return {
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: { quantity: -item.purchasedQty, sold: +item.purchasedQty },
        },
      },
    };
  });

  //  if (count > 0 && count)

  // {
  Product.bulkWrite(bulkOps, {}, (error, product) => {
    if (error) {
      return res.status(400).json({
        error: "Could not update the product",
      });
    }
    next();
  });
  // } else {
  // Product.updateMany(
  //   { _id: proId },
  //   { published: false },
  //   { new: true },
  //   async (err, user) => {
  //     if (err) {
  //       return res.status(400).json({
  //         error: "You are not authorized to perform this action",
  //       });
  //     }
  //     // user.hashed_password = undefined;
  //     // user.salt = undefined;
  //     // res.status(201).json(user);
  //     Cart.deleteOne({ user: req.profile._id }).exec(
  //       async (error, result) => {
  //         if (error) return res.status(400).json({ error });
  //       }
  //     );
  //     return res.status(401).json("fail");
  //   }
  // );
  // }
};

exports.updateQuantity = async (req, res, next) => {
  const { items } = req.body;

  const singleItem = items.map((item) => {
    return item.product;
  });

  const singleQuant = items.map((item) => {
    return item.purchasedQty;
  });

  // const pId = singleItem.map((i) => {
  //   return i.productId;
  // });
  // const valpId = pId[0];
  // console.log(singleItem);
  // if (typeof valpId === "string" || valpId instanceof String) {
  //   // console.log("true");
  // } else {
  //   console.log("false");
  // }
  // console.log(valpId);

  const valpId = singleItem;
  var arrayP = await Product.find(
    {
      _id: { $in: valpId },
    },
    (err, docs) => {
      const pro = docs;
      return pro;
    }
  ).then((data) => {
    return data;
  });
  // console.log(arrayP);
  const counts = arrayP.map((c) => {
    return c.quantity;
  });
  const vCounts = counts;
  // console.log(singleItem);
  // console.log(singleQuant);
  // console.log(arrayP);
  // console.log(vCounts);

  const arr1 = [];
  vCounts.forEach((i) => {
    if (i < 0) {
      return arr1.push(i);
    } else {
      console.log("fail " + i);
    }
  });
  // console.log(arr1);
  const filAr = arrayP.filter((e) => e.quantity < 0);
  // console.log(filAr);
  // console.log(singleQuant);
  const pIdFil = filAr.map((c) => {
    return c._id;
  });

  // console.log(pIdFil);
  // const arr2t = pIdFil.values();
  // const ty5 = 0;
  // for (let letter of arr2t) {
  //   arr2t[letter] = ty5;
  // } //"a" "b" "c" "d" "e"
  // console.log(ty5);
  // const getIdt = pIdFil.forEach((i) => {
  //   return i;
  // });

  // console.log(tel);
  var obj = arr1.reduce(function (acc, cur, i) {
    acc[i] = cur;
    return acc;
  }, {});
  // console.log(obj[0]);
  const keyO = obj[0];

  // req.body.items.fil;
  // var singleProduct = await Product.find({ valpId }, (err, product) => {
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
  // console.log(productx1);
  // const proId = productx1.singleProduct._id;
  // const pub = productx1.singleProduct.published;
  // const count = productx1.singleProduct.quantity;
  // const category = productx1.singleProduct.category._id;
  // console.log(pub);
  // console.log(count);
  // console.log(req.profile._id);

  // return res.status(401).json("fail");

  let bulkOps = filAr.map((item) => {
    // console.log(item);
    // console.log(item.product);
    // console.log(singleItem);
    return {
      updateOne: {
        filter: { _id: item._id },
        update: {
          $inc: { quantity: +0, sold: -item.quantity },
        },
      },
    };
  });

  if (keyO) {
    Product.bulkWrite(bulkOps, {}, (error, product) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update the product",
        });
      }
      // const { productxg } = req.body.payload;
      // if (productxg) {
      // }
      Product.updateMany(
        {
          _id: { $in: pIdFil },
        },
        { published: false },
        { new: true },
        async (err, user) => {
          if (err) {
            return res.status(400).json({
              error: "You are not authorized to perform this action",
            });
          }
          // user.hashed_password = undefined;
          // user.salt = undefined;
          // res.status(201).json(user);
          Cart.update(
            { user: req.profile._id },
            {
              $pull: {
                cartItems: {
                  product: { $in: pIdFil },
                },
              },
            }
          ).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
              // res.status(202).json({ result });
            }
          });
          // Cart.deleteOne({ user: req.profile._id }).exec(
          //   async (error, result) => {
          //     if (error) return res.status(400).json({ error });
          //   }
          // );
          // return res.status(401).json("fail");
        }
      );
      next();
    });
  } else {
    next();
  }
};

exports.getStat = async (req, res) => {
  try {
    await Order.Order.find({}).exec(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          result: "success",
          message: "Fetch Product Successfully",
          data: data,
        });
      }
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
};

exports.getProductSoldMost = async (req, res) => {
  try {
    await Product.find({ published: true })
      .sort("-createdAt")
      .exec(function (err, products) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(products);
        }
      });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
};

exports.getProductsX2 = async (req, res) => {
  const products = await Product.find({})
    .select("_id name price quantity description imageUrl category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};
