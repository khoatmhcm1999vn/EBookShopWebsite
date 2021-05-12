"use strict";
import express from "express";
import {
  getAllCity,
  getAllDistrict,
  getAllWard,
} from "../controllers/address.vn.controller.js";

const addressVnRouter = express.Router();

addressVnRouter.get("/address/city/all", getAllCity);
addressVnRouter.get("/address/city/district/:code", getAllDistrict);
addressVnRouter.post("/address/city/district/ward", getAllWard);

export default addressVnRouter;
