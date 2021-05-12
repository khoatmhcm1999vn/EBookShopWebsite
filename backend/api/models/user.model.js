"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
    },
    phone_number: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "sale", "manager", "admin"],
      default: "user",
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_verify: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("user", user);
const User = mongoose.model("User", userSchema);
export default User;
