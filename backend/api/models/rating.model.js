"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    value: {
      type: Number,
      required: false,
    },

    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
