"use strict";
import Favourite from "../models/favourite.model.js";
import Book from "../models/book.model.js";

export const getFavouriteByIDBook = async (req, res) => {
  if (
    typeof req.body.id_user === "undefined" ||
    typeof req.body.page === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id_user, page } = req.body;
  let count = await Favourite.aggregate([
    { $group: { _id: null, count: { $sum: 1 } } },
    { $project: { _id: 0 } },
  ]);
  count = count[0].count;
  // console.log(count);
  let totalPage = parseInt((count - 1) / 9 + 1);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  Favourite.find({ id_user: id_user })
    .skip(9 * (parseInt(page) - 1))
    .limit(9)
    .sort({ createdAt: 1 })
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
      res.status(200).json({ data: docs, totalPage });
    });
};
export const myfavourite = async (req, res) => {
  if (
    typeof req.body.id_user === "undefined" ||
    typeof req.body.id_book === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }
  let { id_user, id_book, bookTitle, image } = req.body;
  // console.log(req.body);
  try {
    await Book.findById(id_book);
  } catch (err) {
    res.status(422).json({ success: false, message: "👎 Book không tồn tại!" });
    return;
  }
  const new_favourite = Favourite({
    id_user: id_user,
    id_book: id_book,
    bookTitle: bookTitle,
    image: image,
  });
  try {
    await new_favourite.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res.status(201).json({ success: true, message: "👍 Thêm mới thành công!" });
  return;
};
