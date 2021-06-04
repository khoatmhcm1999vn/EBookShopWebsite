"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const supplierSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);
const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
