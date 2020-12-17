const express = require("express");
// const { body } = require("express-validator");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

//middleware routes
const { getUserById } = require("../controllers/userController");

// const { requireSignin, adminMiddleware } = require("../middleware");

const {
  requireSignin,
  isAdmin,
  isAuth,
} = require("../controllers/authController");

// GET /api/categories
router.get("/categories/list", categoryController.getCategories);
router.get("/categories", categoryController.getCategories);
// router.get("/category/:categoryId", categoryController.read);

router.put(
  "/category/update/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  categoryController.updateCategoryX1
);

router.delete(
  "/category/delete/:userId/:id",
  requireSignin,
  isAuth,
  isAdmin,
  categoryController.deleteCategoyX1
);

router.post(
  "/category/create/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  categoryController.createCategoryX1
);

router.get("/categories/listx1", categoryController.getCategoriesX1);
router.get("/category/:id", categoryController.getCategoryX1);

// run the middleware finduserById when there is a param of :userId
router.param("userId", getUserById);
router.param("categoryId", categoryController.getCategoryById);

module.exports = router;
