// const Mongoose = require("mongoose");
// const crypto = require("crypto");
// const { v4: uuidv4 } = require("uuid");

// const uniqueValidator = require("mongoose-unique-validator");
// const { Schema } = Mongoose;

// const UserSchema = new Mongoose.Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//       required: true,
//       maxlength: 32,
//     },
//     email: {
//       type: String,
//       trim: true,
//       required: true,
//       unique: true,
//     },
//     hashed_password: {
//       type: String,
//       required: true,
//     },
//     about: {
//       type: String,
//       trim: true,
//     },
//     salt: String,
//     roles: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Role",
//       },
//     ],
//     // role: {
//     //   type: String,
//     //   default: "ROLE_USER",
//     //   enum: ["ROLE_USER", "ROLE_ADMIN", "ROLE_MERCHANT"],
//     // },
//     avatar: { type: String },
//     status: {
//       type: Number,
//       default: 0,
//     },
//     isVerified: { type: Boolean, default: false },
//     isAdmin: {
//       type: Boolean,
//       // required: true,
//       default: false,
//     },
//     history: {
//       type: Array,
//       default: [],
//     },
//     resetPasswordLink: {
//       data: String,
//       default: "",
//     },
//     resetPasswordToken: { type: String },
//     resetPasswordExpires: { type: Date },
//   },
//   { timestamps: true }

// image: { type: String, required: true },
// status: {
//   type: String,
//   default: 'I am new!'
// },
// isAdmin: {
//   type: Boolean,
//   required: true,
//   default: false,
// }
// );

// // virtual field
// UserSchema.virtual("password")
//   .set(function (password) {
//     this._password = password;
//     this.salt = uuidv4();
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });

// UserSchema.methods = {
//   encryptPassword: function (password) {
//     if (!password) {
//       return "";
//     } else {
//       try {
//         return crypto
//           .createHmac("sha1", this.salt)
//           .update(password)
//           .digest("hex");
//       } catch (err) {
//         return "";
//       }
//     }
//   },

//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },
// };

// UserSchema.plugin(uniqueValidator);

// const User = Mongoose.model("User", UserSchema);

// const ToKenSchema = new Mongoose.Schema({
//   _userId: {
//     type: Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
//   token: { type: String, required: true },
//   createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
// });

// const Token = Mongoose.model("Token", ToKenSchema);

// module.exports = { User };

// module.exports = Mongoose.model("User", UserSchema);

const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// const crypto = require("crypto");
// const { v4: uuidv4 } = require("uuid");
// const uniqueValidator = require("mongoose-unique-validator");
// const { Schema } = Mongoose;

const UserSchema = new Mongoose.Schema(
  {
    // avatars: String,
    // firstName: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   min: 3,
    //   max: 20,
    // },
    // lastName: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   min: 3,
    //   max: 20,
    // },
    // phone: { type: String, default: "" },
    // address: { type: String, default: "" },
    // contactNumber: { type: String },
    // pofilePicture: { type: String },
    // salt: String,
    // roles: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Role",
    //   },
    // ],

    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    hashed_password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: { type: String, default: "not_activated" },
    history: {
      type: Array,
      default: [],
    },
    activated_token: { type: String, default: "" },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

UserSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hashed_password);
  },
};

const User = Mongoose.model("User", UserSchema);

module.exports = User;

// virtual field
// UserSchema.virtual("password")
//   .set(function (password) {
//     this._password = password;
//     this.salt = uuidv4();
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });

// UserSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// UserSchema.methods = {
//   encryptPassword: function (password) {
//     if (!password) {
//       return "";
//     } else {
//       try {
//         return crypto
//           .createHmac("sha1", this.salt)
//           .update(password)
//           .digest("hex");
//       } catch (err) {
//         return "";
//       }
//     }
//   },

//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },
// };

// UserSchema.plugin(uniqueValidator);
