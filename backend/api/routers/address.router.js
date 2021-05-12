import express from "express";
import { requireSignin } from "../middleware/index.js";
import {
  addAddressx1,
  getAddress,
  deleteAddress,
} from "../controllers/address.controller.js";

const addressRouter = express.Router();

addressRouter.post("/user/address/create", requireSignin, addAddressx1);
addressRouter.post("/user/getaddress", requireSignin, getAddress);
addressRouter.post("/user/address/delete", requireSignin, deleteAddress);

export default addressRouter;
