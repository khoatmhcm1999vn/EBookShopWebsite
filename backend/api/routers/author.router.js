"use strict";
import express from "express";
import {
  getAuthor,
  getAll,
  getNameByAuthorID,
} from "../controllers/author.controller.js";

const authorRouter = express.Router();

authorRouter.get("/author", getAuthor);
authorRouter.get("/author/all/:page", getAll);
authorRouter.get("/author/name/:id", getNameByAuthorID);

export default authorRouter;
