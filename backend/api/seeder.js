import fs from "fs";
import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

//load env vars
// dotenv.config({ path: "./config/config.env" });

//load models
import User from "./models/user.model.js";
import Book from "./models/book.model.js";
import Category from "./models/category.model.js";
import Comment from "./models/comment.model.js";
import Bill from "./models/bill.model.js";

// Connect to DB
mongoose.connect(
  process.env.DB_CONN_STRING ||
  "mongodb://nhoxtin14567:Admin123456@cluster0.9whoysl.mongodb.net/",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON files
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/data/users.json`, "utf-8")
// );
// const products = JSON.parse(
//   fs.readFileSync(`${__dirname}/data/product.json`, "utf-8")
// );
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/data/category.json`, "utf-8")
);
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/data/reviews.json`, "utf-8")
// );

//Import into DB
const importData = async () => {
  try {
    //await User.create(users);
    //await Book.create(products);
    await Category.create(categories);
    //await Comment.create(reviews);
    console.log(`Data Imported`.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    //await User.deleteMany();
    //await Book.deleteMany();
    await Category.deleteMany();
    //await Comment.deleteMany();
    //await Bill.deleteMany();
    console.log("Data Destroy".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
