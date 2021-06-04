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
import Supplier from "../models/supplier.model.js";

import multer from "multer";
import expressAsyncHandler from "express-async-handler";
import HttpError from "http-errors";

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/files/");
  },
  filename(req, file, cb) {
    console.log(file.originalname);
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, "-")}-khoamk-${
        file.originalname
      }`
    );
  },
});
// const upload = multer({ storage, fileFilter: excelFilter });
const upload = multer({ storage });

import {
  excelController,
  excelDownloadController,
  excelBookController,
  excelDownloadBookController,
} from "../controllers/admin.controller.js";
import Author from "../models/author.model.js";

const adminRouter = express.Router();

adminRouter.post(
  "/admin/upload",
  upload.single("file"),
  excelController
  //  (req, res) => {
  //   excelController(__basedir + "/files/" + req.file.filename);
  //   res.json({
  //     msg: "File uploaded/import successfully!",
  //     file: req.file,
  //   });
);
adminRouter.get("/admin/download", excelDownloadController);
// post new place
adminRouter.post(
  "/author/upload",
  upload.single("file"),
  expressAsyncHandler(async (req, res) => {
    const authors = new Author();
    authors.name = req.body.name;
    authors.image = req.file.filename;
    authors.isEnabled = false;
    // console.log(authors);
    try {
      authors.save();
      // res.json(authors);
    } catch (err) {
      res.send("Error" + err);
    }
    // fs.unlink(req.file.path, (err) => {
    //   if (err) throw err;
    //   console.log("path/file.txt was deleted");
    // });
    res
      .status(201)
      .json({ success: true, message: "👍 Thêm mới thành công!", authors });
    // res.json({msg: 'fail'})
    // return
  })
);

adminRouter.post(
  "/admin/uploadBook",
  upload.single("file"),
  excelBookController
);
adminRouter.get("/admin/downloadBook", excelDownloadBookController);

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

adminRouter.post(
  "/admin/addsupplier",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    const { name } = req.body;
    let supplierFind;
    supplierFind = await Supplier.find({ name: name });
    if (supplierFind.length > 0) {
      throw new HttpError(500, `👎 Supplier with ${name} đã tồn tại!`);
    }

    // if (supplierFind.length > 0) {
    //   return res
    //     .status(409)
    //     .json({ success: false, message: "👎 Supplier đã tồn tại!" });
    // }

    const newSupplier = new Supplier({ name });
    try {
      await newSupplier.save();
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
      });
    }
    return res
      .status(201)
      .json({ success: true, message: "👍 Thêm mới thành công!" });
  })
);
adminRouter.post(
  "/admin/updatesupplier",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    const { id, name } = req.body;
    let supplierFind;
    try {
      supplierFind = await Supplier.findById(id);
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "👎 Supplier không tồn tại!" });
    }
    if (supplierFind === null) {
      return res
        .status(422)
        .json({ success: false, message: "👎 Supplier không tồn tại!" });
    }
    supplierFind.name = name;
    try {
      await supplierFind.save();
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
      });
    }
    return res.status(201).json({
      success: true,
      message: "👍 Cập nhật thành công!",
      supplier: { name },
    });
  })
);

adminRouter.post(
  "/admin/deletesupplier/:id",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    await Book.updateMany(
      { id_supplier: { $in: req.params.id } },
      { published: false },
      { $set: { published: true } }
    );
    let supplierFind;
    try {
      supplierFind = await Supplier.findById(req.params.id);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        result: "error",
        message: "👎 Không tìm thấy dữ liệu Supplier!",
      });
    }
    supplierFind.isEnabled = false;
    await supplierFind.save();
    return res
      .status(200)
      .json({ result: "success", message: "👍 Xóa thành công!" });
  })
);
adminRouter.get(
  "/admin/deactivatesupplier/:id",
  requireSignin,
  adminMiddleware,
  expressAsyncHandler(async (req, res) => {
    let supplierFind;
    try {
      supplierFind = await Supplier.findById(req.params.id);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "👎 Không tìm thấy dữ liệu Supplier!",
      });
    }
    if (!supplierFind.isEnabled) supplierFind.isEnabled = true;
    else supplierFind.isEnabled = false;
    await supplierFind.save();
    return res.status(200).json({
      success: true,
      message: "👍 Thành công!",
      data: supplierFind,
    });
  })
);

adminRouter.post("/admin/login", login);
adminRouter.get("/me", meController);

export default adminRouter;
