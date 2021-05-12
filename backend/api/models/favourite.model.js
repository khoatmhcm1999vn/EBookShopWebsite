"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const favouriteSchema = new Schema(
  {
    id_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    id_book: {
      type: String,
    },
    bookTitle: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Favourite = mongoose.model("Favourite", favouriteSchema);

export default Favourite;
