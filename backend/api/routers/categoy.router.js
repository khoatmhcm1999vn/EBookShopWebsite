"use strict";
import express from "express";
import {
  getCategory,
  getAll,
  getNameByCategoryID,
  getCategoryUser,
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.get("/category", getCategory);
categoryRouter.get("/user/category", getCategoryUser);
categoryRouter.get("/category/all/:page", getAll);
categoryRouter.get("/category/name/:id", getNameByCategoryID);

export default categoryRouter;
