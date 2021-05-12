"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    isEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", authorSchema);
export default Author;
