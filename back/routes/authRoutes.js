const express = require("express");
const router = express.Router();

// const { body } = require("express-validator");
// const User = require('../models/userModel');
// const isAuth = require('../middleware/authMiddleware');
// const { verifySignUp } = require("../middleware");

const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validator");

const { requireSignin } = require("../middleware");

const {
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
  confirmationPost,
  resendTokenPost,
  activatedAccount,
  resetPasswordX1,
  resetPasswordUpdate,
  getHomeAll,
  signupX2,
  signinX2,
  signoutX2,
  signupx1,
  signinx1,
} = require("../controllers/authController");

const {
  userSignupValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validator");

// router.get("/test/all", getHomeAll);
// router.post(
//   "/signup",
//   // userSignupValidator,
//   signUp
// );
// router.post("/signin", signIn);
// router.get("/signout", signOut);

router.post(
  "/admin/signup",
  validateSignupRequest,
  isRequestValidated,
  signupX2
);

router.post(
  "/admin/signin",
  validateSigninRequest,
  isRequestValidated,
  signinX2
);

router.get("/activation/:token", activatedAccount);
router.post("/password/reset", resetPasswordX1);
router.put("/password/reset", resetPasswordUpdate);
router.post("/admin/signout", signoutX2);

// router.post("/confirmation", confirmationPost);
// router.post("/resend", resendTokenPost);

module.exports = router;
