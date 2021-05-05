import express from "express";
import { requireSignin } from "../middleware/index.js";
import { addAddress, getAddress, deleteAddress } from "../controllers/address.controller.js";

const addressRouter = express.Router();

addressRouter.post("/user/address/create", requireSignin, addAddress);
addressRouter.post("/user/getaddress", requireSignin, getAddress);
addressRouter.post("/user/address/delete", requireSignin, deleteAddress);

export default addressRouter;
