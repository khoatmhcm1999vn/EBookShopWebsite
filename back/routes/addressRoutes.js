const express = require("express");
// const { requireSignin, userMiddleware } = require("../middleware");
const { addAddress, getAddress } = require("../controllers/addressController");

// middleware routes
const { getUserById } = require("../controllers/userController");

const {
  requireSignin,
  isAdmin,
  isAuth,
} = require("../controllers/authController");

const router = express.Router();

router.post("/user/address/create/:userId", requireSignin, isAuth, addAddress);
router.post("/user/getaddress/:userId", requireSignin, isAuth, getAddress);

// run the middleware finduserById when there is a param of :userId
router.param("userId", getUserById);

module.exports = router;
