"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const publisherSchema = new Schema({
  name: {
    type: String,
    required: [true, "can't be blank"],
  },
  isEnabled: {
    required: false,
    type: Boolean,
    default: true,
  },
});

const Publisher = mongoose.model("Publisher", publisherSchema);

export default Publisher;
