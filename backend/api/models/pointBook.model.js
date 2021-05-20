"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const pointSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: false },
  },
  {
    timestamps: true,
  }
);

const Point = mongoose.model("Point", pointSchema);

export default Point;
