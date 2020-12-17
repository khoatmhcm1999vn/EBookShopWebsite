const express = require("express");
const router = express.Router();

const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/authController");

const {
  getUserById,
  addOrderToUserHistory,
  abc,
} = require("../controllers/userController");

const {
  getOrderById,
  createOrder,
  getOrders,
  getOrdersByValue,
  getStatusValues,
  updateOrderStatus,
  updateOrderX1,
  getCustomerOrdersX1,
  addOrderX1,
  getOrdersX1,
  getOrderX2,
} = require("../controllers/orderController");

const {
  decreaseQuantity,
  updateQuantity,
} = require("../controllers/productController");

// const {
//   requireSignin,
//   userMiddleware,
//   adminMiddleware,
// } = require("../middleware");

router.post(
  `/order/update/:userId`,
  requireSignin,
  isAuth,
  isAdmin,
  updateOrderX1
);

router.post(
  `/order/getCustomerOrders/:userId`,
  requireSignin,
  isAuth,
  isAdmin,
  getCustomerOrdersX1
);

router.post(
  "/addOrder/:userId",
  requireSignin,
  isAuth,
  decreaseQuantity,
  updateQuantity,
  abc,
  addOrderToUserHistory,
  addOrderX1
);

router.post("/getOrders/:userId", requireSignin, isAuth, getOrdersX1);

router.post("/getOrder/:userId", requireSignin, isAuth, getOrderX2);

router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, getOrders);
router.get("/order/listchart/", getOrdersByValue);
router.get(
  "/order/status-values/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  getStatusValues
);
router.put(
  "/order/:orderId/status/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  updateOrderStatus
);

router.param("userId", getUserById);
router.param("orderId", getOrderById);

module.exports = router;
