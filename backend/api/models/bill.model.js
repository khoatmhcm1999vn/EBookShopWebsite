"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const billSchema = new Schema(
  {
    // id_user: {
    //   type: String,
    //   required: [true, "can't be blank"],
    //   index: true,
    // },
    // transaction_id: {},
    // updated: Date,

    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAddress",
      required: false,
    },

    products: {
      type: [
        {
          id_category: String,
          name: String,
          price: Number,
          // release_date: Date,
          createdAt: Date,
          img: String,
          describe: String,
          id_nsx: String,
          id_author: String,
          count: Number,
          // sales: Number,
          // quantity: Number,
          _id: String,
        },
      ],
      required: true,
      minlength: 1,
    },
    // issend: {
    //   type: Boolean,
    //   default: false,
    // },

    name: String,
    email: String,
    phone: String,
    ward: String,
    district: String,
    address: String,
    city: String,

    // itemsPrice: { type: Number, required: true },
    // shippingPrice: { type: Number, required: true },
    // taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", billSchema);

export default Bill;
