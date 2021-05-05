import http from "http";
import { Server } from "socket.io";
import express from "express";
const app = express();
const port = process.env.PORT || 8090;
// import path from 'path';
// import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bcrypt from "bcrypt";
import randomstring from "randomstring";

import userRouter from "./api/routers/user.router.js";
import categoryRouter from "./api/routers/categoy.router.js";
import publisherRouter from "./api/routers/publisher.router.js";
import bookRouter from "./api/routers/book.router.js";
import authorRouter from "./api/routers/author.router.js";
import commentRouter from "./api/routers/comment.router.js";
import billRouter from "./api/routers/bill.router.js";
import cartRouter from "./api/routers/cart.router.js";
import adminRouter from "./api/routers/admin.router.js";
// import addressVnRouter from "./api/routers/addres.vn.router.js";
import addressRouter from "./api/routers/address.router.js";
import favouriteRouter from "./api/routers/favourite.router.js";
import braintreeRouter from "./api/routers/braintree.router.js";

import User from "./api/models/user.model.js";
mongoose.Promise = global.Promise;
mongoose
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
  .then(() => {
    console.log("MongoDB is connected!");
    initial();
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
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
        console.log("Added 'admin' to users collection");
      });
    }
  });
}
// import AddressVn from "./api/models/address.vn.model.js";
// const test = () => {
//   Object.keys(data).forEach(function (k) {
//     var _dic = [];
//     var _ward = [];
//     Object.keys(data[k].district).forEach(function (j) {
//       Object.keys(data[k].district[j].ward).forEach(function (l) {
//         _ward.push({
//           name: data[k].district[j].ward[l].name,
//           code: data[k].district[j].ward[l].code,
//         });
//       });
//       _dic.push({
//         name: data[k].district[j].name,
//         code: data[k].district[j].code,
//         ward: _ward,
//       });
//     });
//     const new_address = new AddressVn({
//       city: data[k].name,
//       district: _dic,
//       code: data[k].code,
//     });
//     try {
//       new_address.save();
//     } catch (Err) {
//       console.log(Err);
//     }
//   });
// };
// test();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(
//   bodyParser.urlencoded({
//     limit: "50mb",
//     extended: true,
//     parameterLimit: 50000,
//   })
// );
const allowedOrigins = [
  "http://localhost:4000",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://bookshopweb.netlify.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return res.json({ status: "error", msg });
      }
      return callback(null, true);
    },
  })
);

app.use("", userRouter);
app.use("", adminRouter);
app.use("", categoryRouter);
app.use("", publisherRouter);
app.use("", authorRouter);
app.use("", bookRouter);
app.use("", commentRouter);
app.use("/api", favouriteRouter);
app.use("", cartRouter);
app.use("", billRouter);
// app.use("", addressVnRouter);
app.use("/api/address", addressRouter);
app.use("/api", braintreeRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Book Shop MIA!");
});
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
// app.get('/api/config/google', (req, res) => {
//   res.send(process.env.GOOGLE_API_KEY || '');
// });
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const httpServer = http.Server(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const users = [];

io.on("connection", (socket) => {
  console.log("connection", socket.id);
  socket.on("disconnect", () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      console.log("Offline", user.name);
      const admin = users.find((x) => x.is_admin && x.online);
      if (admin) {
        io.to(admin.socketId).emit("updateUser", user);
      }
    }
  });
  socket.on("onLogin", (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    };
    const existUser = users.find((x) => x._id === updatedUser._id);
    if (existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    console.log("Online", user.name);
    const admin = users.find((x) => x.is_admin && x.online);
    if (admin) {
      io.to(admin.socketId).emit("updateUser", updatedUser);
    }
    if (updatedUser.is_admin) {
      io.to(updatedUser.socketId).emit("listUsers", users);
    }
  });
  socket.on("onUserSelected", (user) => {
    const admin = users.find((x) => x.is_admin && x.online);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit("selectUser", existUser);
    }
  });
  socket.on("onMessage", (message) => {
    if (message.is_admin) {
      const user = users.find((x) => x._id === message._id && x.online);
      if (user) {
        io.to(user.socketId).emit("message", message);
        user.messages.push(message);
      }
    } else {
      const admin = users.find((x) => x.is_admin && x.online);
      if (admin) {
        io.to(admin.socketId).emit("message", message);
        const user = users.find((x) => x._id === message._id && x.online);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit("message", {
          name: "Admin",
          body: "Sorry. I am not online right now",
        });
      }
    }
  });
});
httpServer.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
