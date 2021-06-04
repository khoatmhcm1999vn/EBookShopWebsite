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
    id_flashSales: {
      type: Schema.Types.ObjectId,
      ref: "FlashSale",
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
    },
    episode: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "can't be blank"],
    },
    sellPrice: {
      type: Number,
      default: 0,
    },
    currencyUnit: {
      type: String,
      enum: ["VND", "USD"],
      default: "VND",
    },
    quantity: {
      type: Number,
      required: [true, "can't be blank"],
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
    sold_date: {
      type: Date,
      $dateToString: { format: "%Y-%m-%d", date: "$date" },
      default: new Date(),
    },
    img: {
      type: String,
      required: [true, "can't be blank"],
    },
    // image_details: [String],
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
    id_supplier: {
      type: String,
      // required: [true, "can't be blank"],
    },
    stars: {
      default: 0,
      type: Number,
    },
    reviewCount: {
      default: 0,
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
    ratings: {
      type: Array,
      default: 0,
    },
    // ratingx1: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
  },
  {
    timestamps: true,
  }
);
bookSchema.virtual("id").get(function () {
  return this._id.toString();
});
const Book = mongoose.model("Book", bookSchema);
export default Book;
