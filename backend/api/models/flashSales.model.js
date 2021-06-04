"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const flashSaleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
    },
    isEnabled: {
      required: false,
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default: "",
    },
    describe: {
      type: String,
      default: "",
    },
    salesPercentage: {
      type: Number,
      default: 0.0,
      //   validate: {
      //     validator: Number.isInteger,
      //     message: "{VALUE} is not an integer value",
      //   },
    },
    end_date: {
      type: Date,
      $dateToString: { format: "%Y-%m-%d", date: "$date" },
      // default: new Date(),
    },
    bookId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  },
  {
    timestamps: true,
  }
);
flashSaleSchema.virtual("id").get(function () {
  return this._id.toString();
});
const FlashSale = mongoose.model("FlashSale", flashSaleSchema);
export default FlashSale;
