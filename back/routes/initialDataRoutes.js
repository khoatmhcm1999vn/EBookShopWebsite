const express = require("express");
// const { requireSignin, adminMiddleware } = require("../middleware");
const { initialData } = require("../controllers/initialDataController");
const router = express.Router();

// middleware routes
const { getUserById } = require("../controllers/userController");

const {
  requireSignin,
  isAdmin,
  isAuth,
} = require("../controllers/authController");

router.get("/initialdata/:userId", requireSignin, isAuth, isAdmin, initialData);

// adminMiddleware,
// run the middleware finduserById when there is a param of :userId
router.param("userId", getUserById);

module.exports = router;
