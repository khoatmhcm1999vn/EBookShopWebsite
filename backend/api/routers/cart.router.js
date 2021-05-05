"use strict";
import express from "express";
import {
  addToCart,
  getAll,
  update,
  deleteCart,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/cart/addtocard", addToCart);
cartRouter.get("/cart/:id_user", getAll);
cartRouter.post("/cart/update", update);
cartRouter.post("/cart/delete", deleteCart);

export default cartRouter;
