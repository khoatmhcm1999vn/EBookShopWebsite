import express from "express";
const braintreeRouter = express.Router();
import {
  generateToken,
  processPayment,
} from "../controllers/braintree.controller.js";
// import { requireSignin } from "../middleware/index.js";

braintreeRouter.get("/braintree/getToken", generateToken);
braintreeRouter.post("/braintree/payment", processPayment);

export default braintreeRouter;
