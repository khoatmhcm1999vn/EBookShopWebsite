"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: [true, "can't be blank"],
      index: { unique: true },
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
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: Number,
    // token: {
    //   type: String,
    //   default: "",
    // },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});
userSchema.methods.incrementLoginAttempts = function (callback) {
  console.log("lock until", this.lockUntil);
  // if we have a previous lock that has expired, restart at 1
  var lockExpired = !!(this.lockUntil && this.lockUntil < Date.now());
  console.log("lockExpired", lockExpired);
  if (lockExpired) {
    return this.update(
      {
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 },
      },
      callback
    );
  }
  // otherwise we're incrementing
  var updates = { $inc: { loginAttempts: 1 } };
  // lock the account if we've reached max attempts and it's not locked already
  var needToLock = !!(this.loginAttempts + 1 >= 5 && !this.isLocked);
  console.log("needToLock", needToLock);
  console.log("loginAttempts", this.loginAttempts);
  if (needToLock) {
    updates.$set = { lockUntil: Date.now() + 3600000 };
    console.log("config.login.lockoutHours", Date.now() + 3600000);
  }
  //console.log("lockUntil",this.lockUntil)
  return this.updateOne(updates, callback);
};

// module.exports = mongoose.model("user", user);
const User = mongoose.model("User", userSchema);
export default User;
