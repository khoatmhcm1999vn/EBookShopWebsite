"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    id_category: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "can't be blank"],
    },
    quantity: {
      type: Number,
    },
    published: {
      required: false,
      type: Boolean,
      default: true,
    },
    release_date: {
      type: Date,
      $dateToString: { format: "%Y-%m-%d", date: "$date" },
      default: new Date(),
    },
    img: {
      type: String,
      required: [true, "can't be blank"],
    },
    describe: {
      type: String,
      default: "",
    },
    id_nsx: {
      type: String,
      required: [true, "can't be blank"],
    },
    id_author: {
      type: String,
      required: [true, "can't be blank"],
    },
    stars: {
      type: Number,
    },
    reviewCount: {
      type: Number,
    },
    view_counts: {
      type: Number,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    sales: {
      type: Number,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
