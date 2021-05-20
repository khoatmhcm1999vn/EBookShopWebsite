"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    id_user: {
      type: String,
      default: "no_user",
    },
    id_book: {
      type: String,
      required: [true, "can't be blank"],
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    ratingValue: {
      // default: 0,
      type: Number,
    },
    comment: {
      type: String,
    },
    // date: {
    //   type: Date,
    //   default: new Date(),
    // },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
