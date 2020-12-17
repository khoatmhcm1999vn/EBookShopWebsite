const express = require("express");
const {
  addItemToCart,
  // addToCart,
  getCartItems,
  removeCartItems,
} = require("../controllers/cartController");

// const { requireSignin, userMiddleware } = require("../middleware");

// middleware routes
const { getUserById } = require("../controllers/userController");

const {
  requireSignin,
  isAdmin,
  isAuth,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/user/cart/addtocart/:userId",
  requireSignin,
  isAuth,
  addItemToCart
  // isAdmin,
);

//router.post('/user/cart/addToCartByLogin', requireSignin, userMiddleware, addToCart);
router.post(
  "/user/getCartItems/:userId",
  requireSignin,
  isAuth,
  // isAdmin,
  getCartItems
);

//new update
router.post(
  "/user/cart/removeItem/:userId",
  requireSignin,
  isAuth,
  // userMiddleware,
  removeCartItems
);

// run the middleware finduserById when there is a param of :userId
router.param("userId", getUserById);

module.exports = router;
