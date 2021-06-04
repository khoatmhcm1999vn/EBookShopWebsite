"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    id_user: {
      type: String,
    },
    // date: {
    //   type: Date,
    //   default: new Date(),
    // },
    products: {
      type: [
        {
          id_category: String,
          id_supplier: String,
          name: String,
          price: Number,
          sellPrice: Number,
          stars: Number,
          // release_date: Date,
          img: String,
          // describe: String,
          id_nsx: String,
          id_author: String,
          count: Number,
          sales: Number,
          quantity: Number,
          _id: String,
        },
      ],
      required: true,
      minlength: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
