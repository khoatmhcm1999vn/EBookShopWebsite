"use strict";
import Comment from "../models/comment.model.js";
import Book from "../models/book.model.js";

export const mycomment = async (req, res) => {
  if (
    typeof req.body.id_user === "undefined" ||
    typeof req.body.id_book === "undefined" ||
    typeof req.body.name === "undefined" ||
    typeof req.body.comment === "undefined" ||
    typeof req.body.ratingValue === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Dữ liêu nhập vào bị lỗi!" });
    return;
  }

  let { id_user, id_book, name, comment, ratingValue } = req.body;
  let bookFind;
  try {
    bookFind = await Book.findById(id_book);
  } catch (err) {
    res
      .status(422)
      .json({ success: false, message: " 👎 Book không tồn tại!" });
    return;
  }
  const new_comment = Comment({
    id_user: id_user,
    id_book: id_book,
    name: name,
    comment: comment,
    ratingValue: ratingValue,
  });
  try {
    await new_comment.save();
    const comments = await Comment.find({ id_book: id_book });
    let ratingTotal = 0;
    comments.map((item) => {
      ratingTotal += item.ratingValue;
    });
    bookFind.stars = (ratingTotal / comments.length).toFixed(2);
    bookFind.reviewCount = comments.length;
    await bookFind.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: " 👎 Có sự cố xảy ra khi lưu vào trong database!",
    });
    return;
  }
  res.status(201).json({ success: true, message: " 👍 Thành công!" });
  return;
};

export const getCommentByIDBook = async (req, res) => {
  if (
    typeof req.body.id_book === "undefined" ||
    typeof req.body.page === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id_book, page } = req.body;
  let count = await Comment.count({ id_book: id_book });
  let totalPage = parseInt((count - 1) / 9 + 1);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  Comment.find({ id_book: id_book })
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
