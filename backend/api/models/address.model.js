import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 100,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  ward: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 100,
  },
});

const userAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    address: [addressSchema],
  },
  { timestamps: true }
);

mongoose.model("Address", addressSchema);
const UserAddress = mongoose.model("UserAddress", userAddressSchema);

export default UserAddress;
