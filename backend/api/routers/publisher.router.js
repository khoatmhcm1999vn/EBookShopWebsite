"use strict";
import express from "express";
import {
  getAll,
  getPublisher,
  getNameByPublisherID,
} from "../controllers/publisher.controller.js";

const publisherRouter = express.Router();

publisherRouter.get("/publisher/all/:page", getAll);
publisherRouter.get("/publisher", getPublisher);
publisherRouter.get("/publisher/name/:id", getNameByPublisherID);

export default publisherRouter;
