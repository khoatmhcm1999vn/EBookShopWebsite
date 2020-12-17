const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const CartItemSchema = new Mongoose.Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    count: Number,
  },
  { timestamps: true }
);

const CartItem = Mongoose.model("CartItem", CartItemSchema);

const OrderSchema = new Mongoose.Schema(
  {
    // products: [CartItemSchema],
    transaction_id: {},
    totalAmount: {
      type: Number,
      required: true,
    },
    // address: String,
    // status: {
    //   type: String,
    //   default: "Not processed",
    //   enum: [
    //     "Not processed",
    //     "Processing",
    //     "Shipped",
    //     "Delivered",
    //     "Cancelled",
    //   ], // enum means string objects
    // },
    updated: Date,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    addressId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "UserAddress.address",
      required: true,
    },
    items: [
      {
        product: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchasedQty: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      // default: "pending",
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cod", "card"],
      required: true,
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "packed", "shipped", "delivered"],
          default: "ordered",
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Order = Mongoose.model("Order", OrderSchema);

module.exports = { Order, CartItem };
