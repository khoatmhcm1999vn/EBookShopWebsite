"use strict";
import express from "express";
import {
  addBook,
  updateBook,
  deletebook,
  deactivateBook,
  addUser,
  getAllUser,
  updateUser,
  deleteUser,
  deactivateUser,
  addCategory,
  updateCategory,
  deleteCategory,
  deactivateCategory,
  addAuthor,
  updateAuthor,
  deleteAuthor,
  deactivateAuthor,
  addPublisher,
  updatePublisher,
  deletePublisher,
  deactivatePublisher,
  login,
  meController,
} from "../controllers/admin.controller.js";
import { requireSignin, adminMiddleware } from "../middleware/index.js";
import Book from "../models/book.model.js";

import multer from "multer";
import expressAsyncHandler from "express-async-handler";
const storage = multer.diskStorage({
  destination: "./files",
  filename(req, file, cb) {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`
    );
  },
});
const upload = multer({ storage });

const adminRouter = express.Router();

adminRouter.post(
  "/admin/addbook",
  upload.single("file"),
  requireSignin,
  adminMiddleware,
  addBook
);
adminRouter.post(
  "/admin/updatebook",
  upload.single("file"),
  requireSignin,
  adminMiddleware,
  updateBook
);
adminRouter.put(
  "/admin/book/inline_update",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    let id = req.body._id;
    let column = req.body.column;
    let value = req.body.value < 1 ? 0 : req.body.value;
    // page ? page * limit : 0;
    // console.log(column)
    try {
      await Book.updateOne(
        { _id: id },
        { $set: { [column]: value } },
        function (err, result) {
          if (err) {
            res.json({ result: "error", message: err.msg });
          } else {
            if (value < 1) {
              value = 0;
            }
            res.json({
              result: result,
              message: "Update Product data Successfully",
            });
          }
        }
      );
    } catch (err) {
      res.json({ result: "error", message: err.msg });
    }
  })
);

adminRouter.get(
  "/admin/deletebook/:id",
  requireSignin,
  adminMiddleware,
  deletebook
);
adminRouter.get(
  "/admin/deactivatebook/:id",
  requireSignin,
  adminMiddleware,
  deactivateBook
);
adminRouter.delete(
  "/book/bulk_delete/:id",
  requireSignin,
  adminMiddleware,
  async (req, res) => {
    let id = req.params.id.split(",");
    console.log(id);
    // try {
    let response = await Book.updateMany(
      { _id: { $in: id } },
      { published: false },
      { new: true },
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            result: "success",
            message: "Bulk Delete Successfully",
            data: data,
          });
        }
      }
    );
    // } catch (err) {
    //   res.json({ result: "error", message: err.msg });
    // }
  }
);

adminRouter.post("/admin/adduser", requireSignin, adminMiddleware, addUser);
adminRouter.get(
  "/admin/getAllUser/:page",
  requireSignin,
  adminMiddleware,
  getAllUser
);
adminRouter.post(
  "/admin/updateuser",
  requireSignin,
  adminMiddleware,
  updateUser
);
adminRouter.post(
  "/admin/deleteuser",
  requireSignin,
  adminMiddleware,
  deleteUser
);
adminRouter.post(
  "/admin/deactivateuser",
  requireSignin,
  adminMiddleware,
  deactivateUser
);

adminRouter.post(
  "/admin/addcategory",
  requireSignin,
  adminMiddleware,
  addCategory
);
adminRouter.post(
  "/admin/updatecategory",
  requireSignin,
  adminMiddleware,
  updateCategory
);
adminRouter.post(
  "/admin/deletecategory/:id",
  requireSignin,
  adminMiddleware,
  deleteCategory
);
adminRouter.post(
  "/admin/deactivatecategory/:id",
  requireSignin,
  adminMiddleware,
  deactivateCategory
);

adminRouter.post("/admin/addauthor", requireSignin, adminMiddleware, addAuthor);
adminRouter.post(
  "/admin/updateauthor",
  requireSignin,
  adminMiddleware,
  updateAuthor
);
adminRouter.post(
  "/admin/deleteauthor/:id",
  requireSignin,
  adminMiddleware,
  deleteAuthor
);
adminRouter.get(
  "/admin/deactivateauthor/:id",
  requireSignin,
  adminMiddleware,
  deactivateAuthor
);

adminRouter.post(
  "/admin/addpublisher",
  requireSignin,
  adminMiddleware,
  addPublisher
);
adminRouter.post(
  "/admin/updatepublisher",
  requireSignin,
  adminMiddleware,
  updatePublisher
);
adminRouter.post(
  "/admin/deletepublisher/:id",
  requireSignin,
  adminMiddleware,
  deletePublisher
);
adminRouter.post(
  "/admin/deactivatepublisher/:id",
  requireSignin,
  adminMiddleware,
  deactivatePublisher
);

adminRouter.post("/admin/login", login);
adminRouter.get("/me", meController);

export default adminRouter;
