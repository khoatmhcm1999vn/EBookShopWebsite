"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  id_user: {
    type: String,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  products: {
    type: [
      {
        id_category: String,
        name: String,
        price: Number,
        release_date: Date,
        img: String,
        describe: String,
        id_nsx: String,
        id_nsx: String,
        count: Number,
        sales: Number,
        quantity: Number,
        _id: String,
      },
    ],
    required: true,
    minlength: 1,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;