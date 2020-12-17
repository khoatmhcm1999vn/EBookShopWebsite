const express = require("express");
const router = express.Router();

// const { check } = require("express-validator");
// const fileUpload = require("../middleware/fileUploadMiddleware");
// const { authJwt } = require("../middleware");

const {
  requireSignin,
  isAdmin,
  isAuth,
} = require("../controllers/authController");

const {
  getUserById,
  read,
  updateUser,
  purchaseHistory,
  getProfileById,
  updateProfileX1,
  update,
} = require("../controllers/userController");

// const { requireSignin, userMiddleware } = require("../middleware");

// router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
//   res.json({
//     user: req.profile,
//   });
// });

// CRUD routes
router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, updateUser);
router.get(
  "/orders/by/user/:userId",
  requireSignin,
  isAuth,
  // userMiddleware,
  purchaseHistory
);
router.get("/profile/:userId", requireSignin, isAuth, getProfileById);
router.put("/profile/update/:userId", requireSignin, isAuth, updateProfileX1);
router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

// run the middleware finduserById when there is a param of :userId
router.param("userId", getUserById);

module.exports = router;
