"use strict";
import express from "express";
import {
  getAll,
  getPublisher,
  getNameByPublisherID,
  getPublisherUser,
} from "../controllers/publisher.controller.js";

const publisherRouter = express.Router();

publisherRouter.get("/publisher/all/:page", getAll);
publisherRouter.get("/user/publisher", getPublisherUser);
publisherRouter.get("/publisher", getPublisher);
publisherRouter.get("/publisher/name/:id", getNameByPublisherID);

export default publisherRouter;
