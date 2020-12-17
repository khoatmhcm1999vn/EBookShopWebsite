const Mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
// const { Schema } = Mongoose;

const ProductSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },

    published: {
      required: false,
      type: Boolean,
      default: false,
    },

    imageUrl: {
      type: String,
      required: false,
    },

    // content: {
    //   type: String,
    //   required: true,
    // },
    // s3_key: { type: String },
    // visitor: [visitorSchema],
    // photo: {
    //   data: Buffer,
    //   contentType: String,
    // },
    // offer: { type: Number },
    // productPictures: [{ img: { type: String } }],
    // reviews: [
    //   {
    //     userId: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    //     review: String,
    //   },
    // ],
    // createdBy: {
    //   type: Mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    // category: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "category",
    //     // required: true,
    //   },
    // ],
    // creator: {
    //     type: ObjectId,
    //     ref: 'User',
    //     required: true
    // }
    // updatedAt: Date,

    description: {
      type: String,
      trim: true,
      required: false,
      maxlength: 2000,
    },

    quantity: {
      type: Number,
    },

    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },

    category: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
      },
    ],

    sold: {
      type: Number,
      default: 0,
    },

    shipping: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);

module.exports = Mongoose.model("Product", ProductSchema);
