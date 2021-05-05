"use strict";
import express from "express";
import {
  mycomment,
  getCommentByIDBook,
} from "../controllers/comment.controller.js";
import { requireSignin } from "../middleware/index.js";

const commentRouter = express.Router();

commentRouter.post("/comment", requireSignin, mycomment);
commentRouter.post("/comment/book", getCommentByIDBook);

export default commentRouter;
