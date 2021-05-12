import mongoose from "mongoose";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import User from "../models/user.model.js";

// import dotenv from "dotenv";
// dotenv.config();

function initial() {
  let password = "abcdef1";
  const token = randomstring.generate();
  User.collection.estimatedDocumentCount(async (err, count) => {
    password = await bcrypt.hash(password, 10);
    if (!err && count === 0) {
      new User({
        email: "admin@gmail.com",
        firstName: "Admin",
        lastName: "admin",
        password: password,
        phone_number: "0911321145",
        token: token,
        is_admin: true,
        is_verify: true,
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("Added 'admin' to users collection".red.bold);
      });
    }
  });
}

const connectDB = async () => {
  const conn = await mongoose
    .connect(
      process.env.MONGO_DB_URI ||
        "mongodb+srv://myMongoDBUser:Abc123456@cluster0.kpppm.mongodb.net/bookshop?retryWrites=true",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    )
    .catch((err) => {
      console.log("Cannot connect to the database!".red.bold, err);
      process.exit();
    });
  initial();
  console.log(
    `Mongo database connected on ${conn.connection.host}`.cyan.underline.bold
  );
};
export default connectDB;
