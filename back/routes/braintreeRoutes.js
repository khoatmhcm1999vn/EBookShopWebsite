const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/authController");

const { getUserById } = require("../controllers/userController");

const {
  generateToken,
  processPayment,
} = require("../controllers/braintreeController");

// const { requireSignin, userMiddleware } = require("../middleware");

router.get(
  "/braintree/getToken/:userId",
  requireSignin,
  isAuth,
  // userMiddleware,
  generateToken
);

router.post(
  "/braintree/payment/:userId",
  requireSignin,
  isAuth,
  // userMiddleware,
  processPayment
);

router.param("userId", getUserById);

module.exports = router;
