import express from "express";
const braintreeRouter = express.Router();
import {
  generateToken,
  processPayment,
} from "../controllers/braintree.controller.js";
import { requireSignin } from "../middleware/index.js";

braintreeRouter.get("/braintree/getToken", requireSignin, generateToken);
braintreeRouter.post("/braintree/payment", requireSignin, processPayment);

export default braintreeRouter;
