const express = require("express");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const formidable = require("formidable");
const path = require("path");
const fs = require("fs-extra");

const router = express.Router();

const productController = require("../controllers/productController");

//middleware routes
const { getUserById } = require("../controllers/userController");

const {
  requireSignin,
  isAdmin,
  isAuth,
} = require("../controllers/authController");

// const { requireSignin, adminMiddleware } = require("../middleware");

router.get("/getProductX2 ", productController.getProductsX2);

// Retrieve all Tutorials
router.get("/findproducts", productController.getAllProductPublishedX1);
router.get("/published", productController.getAllProductPublished);
router.get("/stat_product", productController.getStat);

// Retrieve all published Tutorials
router.get("/published", productController.findAllPublished);

// CRUD Methods
router.get("/product/:productId", productController.read);

//Customed GET routes
router.get("/listproducts", productController.getProducts);
router.get("/products", productController.list);
router.get("/products/search", productController.listSearch);
router.get("/products/related/:productId", productController.listRelated);
router.get("/products/categories", productController.listCategories);

//Customed POST routes
router.post("/products/by/search", productController.listBySearch);
router.get("/sold", productController.getProductSoldMost);

router.post(
  "/product/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  async (req, res) => {
    // console.log(req);
    try {
      var form = new formidable.IncomingForm();

      form.parse(req, async (err, fields, files) => {
        let newProduct = await Product.create({
          name: fields.name,
          description: fields.description,
          quantity: fields.quantity,
          price: fields.price,
          published: fields.published,
        });

        await uploadImagexg1(files, newProduct);

        let cate_arr = fields.category.split(",");
        const cate = await Category.find().where("_id").in(cate_arr).exec();
        // console.log(newProduct);
        newProduct.category = cate;
        await newProduct.save();
        res.json({
          result: "success",
          message: "Create Product data successfully",
          newProduct,
        });
      });
    } catch (err) {
      res.json({ result: "error", message: err.msg });
    }
  }
);

router.get("/branch/:id", async (req, res) => {
  try {
    await Product.findById({ _id: req.params.id })
      .populate("category")
      .exec(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            result: "success",
            message: "Fetch Single Branch Successfully",
            data: data,
          });
        }
      });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});

const uploadImagexg1 = async (files, doc) => {
  if (files.imageUrl != null) {
    var fileExtention = files.imageUrl.name.split(".").pop();
    doc.imageUrl = `${Date.now()}+${doc.name}.${fileExtention}`;
    var newpath =
      path.resolve(__dirname + "/uploaded/images/") + "/" + doc.imageUrl;

    if (fs.exists(newpath)) {
      await fs.remove(newpath);
    }
    await fs.move(files.imageUrl.path, newpath);

    // Update database
    await Product.findOneAndUpdate({ _id: doc.id }, doc);
  }
};

router.put(
  "/product/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  async (req, res) => {
    try {
      var form = new formidable.IncomingForm();

      form.parse(req, async (err, fields, files) => {
        let updateProduct = await Product.findByIdAndUpdate(
          { _id: fields.id },
          {
            name: fields.name,
            published: fields.published,
            description: fields.description,
            quantity: fields.quantity,
            price: fields.price,
          }
        );

        // ({ _id: fields.id }, { fields });
        let cate_arr = fields.category.split(",");
        const cate = await Category.find().where("_id").in(cate_arr).exec();
        updateProduct.category = cate;

        await updateProduct.save();
        await uploadImagexg1(files, updateProduct);

        res.json({
          result: "success",
          message: "Update Product data successfully",
          updateProduct,
        });
      });
    } catch (err) {
      res.json({ result: "error", message: err.msg });
    }
  }
);

router.put(
  "/product/inline_update/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  async (req, res) => {
    let id = req.body._id;
    let column = req.body.column;
    let value = req.body.value < 1 ? 1 : req.body.value;
    // page ? page * limit : 0;
    // console.log(column)
    try {
      let doc = await Product.update(
        { _id: id },
        { $set: { [column]: value } },
        function (err, result) {
          if (err) {
            res.json({ result: "error", message: err.msg });
          } else {
            if (value < 1) {
              value = 1;
            }
            // console.log(value);
            res.json({
              result: result,
              message: "Update Product data Successfully",
              // doc,
            });
          }
        }
      );
    } catch (err) {
      res.json({ result: "error", message: err.msg });
    }
  }
);

router.delete(
  "/product/:userId/:id",
  requireSignin,
  isAuth,
  isAdmin,
  async (req, res) => {
    // console.log(req.params.id);
    try {
      let response = await Product.findOneAndDelete({ _id: req.params.id });

      res.json({
        result: "success",
        message: "Delete Product Successfully",
        response,
      });
    } catch (err) {
      res.json({ result: "error", message: err.msg });
    }
  }
);

router.delete(
  "/product/bulk_delete/:userId/:id",
  requireSignin,
  isAuth,
  isAdmin,
  async (req, res) => {
    let id = req.params.id.split(",");
    // console.log(id);
    // try {
    let response = await Product.deleteMany(
      { _id: { $in: id } },
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            result: "success",
            message: "Bulk Delete Successfully",
            data: data,
          });
        }
      }
    );

    // } catch (err) {
    //   res.json({ result: "error", message: err.msg });
    // }
  }
);

// run the middleware finduserById when there is a param of :userId
router.param("userId", getUserById);
router.param("productId", productController.getProductById);

module.exports = router;
