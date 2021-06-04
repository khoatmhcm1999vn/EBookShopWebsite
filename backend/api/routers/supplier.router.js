"use strict";
import express from "express";
import {
  getAll,
  getSupplier,
  getNameBySupplierID,
  getSupplierUser,
} from "../controllers/supplier.controller.js";

const supplierRouter = express.Router();

supplierRouter.get("/supplier/all/:page", getAll);
supplierRouter.get("/user/supplier", getSupplierUser);
supplierRouter.get("/supplier", getSupplier);
supplierRouter.get("/supplier/name/:id", getNameBySupplierID);

export default supplierRouter;
