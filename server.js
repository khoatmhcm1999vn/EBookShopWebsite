import http from "http";
import createError from "http-errors";
import { Server } from "socket.io";
import express from "express";
const app = express();
const port = process.env.PORT || 8090;
import path from "path";
import child_process from "child_process";
import { fileURLToPath } from "url";
// import bodyParser from "body-parser";
import morgan from "morgan";
// import i18n from "i18n";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import error from "./backend/api/middleware/error.js";
import connectDB from "./backend/api/config/db.js";
import authRouter from "./backend/api/routers/auth.router.js";
import userRouter from "./backend/api/routers/user.router.js";
import categoryRouter from "./backend/api/routers/categoy.router.js";
import publisherRouter from "./backend/api/routers/publisher.router.js";
import supplierRouter from "./backend/api/routers/supplier.router.js";
import bookRouter from "./backend/api/routers/book.router.js";
import authorRouter from "./backend/api/routers/author.router.js";
import commentRouter from "./backend/api/routers/comment.router.js";
import billRouter from "./backend/api/routers/bill.router.js";
import cartRouter from "./backend/api/routers/cart.router.js";
import adminRouter from "./backend/api/routers/admin.router.js";
import addressVnRouter from "./backend/api/routers/addres.vn.router.js";
import addressRouter from "./backend/api/routers/address.router.js";
import favouriteRouter from "./backend/api/routers/favourite.router.js";
import braintreeRouter from "./backend/api/routers/braintree.router.js";
import flashSalesRouter from "./backend/api/routers/flashSales.router.js";

// import fileUpload from "express-fileupload";
import _ from "lodash";
// import HttpError from "./backend/api/models/http-error.js";
connectDB();
// import AddressVn from "./backend/api/models/address.vn.model.js";
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.__basedir = __dirname;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(__basedir + "/files/"));
app.use(express.urlencoded({ extended: true }));
// app.use(
//   fileUpload({
//     useTempFiles: true,
//   })
// );
//-----------------CUSTOM CONTROLLER------------------
// app.use(i18n.init);
// i18n.configure({
//   locales: ["en", "vi"],
//   directory: __basedir + "/files/locales",
//   cookie: "lang",
// });
//--------------------------------------------------------
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

app.use("/v1/auth", authRouter);
app.use("", userRouter);
app.use("", adminRouter);
app.use("", categoryRouter);
app.use("", publisherRouter);
app.use("", supplierRouter);
app.use("", authorRouter);
app.use("", bookRouter);
app.use("", commentRouter);
app.use("/api", favouriteRouter);
app.use("", cartRouter);
app.use("", billRouter);
app.use("", addressVnRouter);
app.use("/api/address", addressRouter);
app.use("/api", braintreeRouter);
app.use("", flashSalesRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Book Shop MIA!");
  // let convert = (arrObj) => {
  //   let origin = _.chunk(arrObj, 2);
  //   let sig = (colorCode, colorQuantity) => {
  //     let tm = {
  //       code: colorCode,
  //       quantity: colorQuantity,
  //     };
  //     return tm;
  //   };
  //   console.log("a");
  //   console.log(sig);
  //   let newArr = origin.slice();
  //   let objConverted = [];
  //   newArr.forEach((item) => {
  //     objConverted.push(sig(...item));
  //   });
  //   console.log(objConverted);
  //   // return objConverted;
  // };
  // convert();
});

// app.post("/name", callName);
// function callName(req, res) {
//   const { spawn } = child_process;
//   // E.g : http://localhost:3000/name?firstname=van&lastname=nghia
//   const process = spawn("python", [
//     "./process.py",
//     req.query.firstname,
//     req.query.lastname,
//   ]);
//   process.stdout.on("data", function (data) {
//     console.log(data.toString());
//     res.send(data.toString());
//   });
// }

const recommendProducts = (req, res, next) => {
  try {
    const { spawn } = child_process;
    var process = spawn("python", ["./recommend.py"]);
    process.stdout.on("data", async (data) => {
      // Convert string to JSON
      console.log(data);
      console.log(data.toString());
      // var _data = JSON.stringify(data.toString());
      var result = JSON.parse(data);
      // console.log(result);
      // await Product.populate(result, { path: 'data', select: ['name', 'bigimage', 'stars', 'price_min', 'pathseo', 'active'],
      // populate : {path : 'bigimage', select: "public_url"} });
      return res.status(200).json({ success: true, code: 200, data: result });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
app.post("/products-recommend", recommendProducts);

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}
// app.get('/api/config/google', (req, res) => {
//   res.send(process.env.GOOGLE_API_KEY || '');
// });

// Catch 404 error and forward them to error handler
// app.use((req, res, next) => {
//   const error = new HttpError("Could not find this route.", 404);
//   err.status = 404;
//   console.log(error.message);
//   throw error;
//   next(error);
// });
// app.use((err, req, res, next) => {
//   const error = app.get("env") === "development" ? err : {};
//   const status = err.status || 500;
//   return res.status(status).json({
//     error: {
//       message: error.message,
//     },
//   });
// });
// app.use((err, req, res, next) => {
//   res.status(500).send({ message: err.message });
// });

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

// Handle unhandle promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // close the server
  httpServer.close(() => process.exit(1));
});
// app.use(error.unknownEndpoints);
app.use((req, res, next) => {
  next(createError(404));
});
app.use(error.errorHandler);

httpServer.listen(
  port,
  console.log(
    `Server running in http://localhost:${port} mode on port ${port}`.yellow
      .bold
  )
  //   () => {
  //   console.log(`Server is running at http://localhost:${port}`.yellow.bold);
  // }
);

// # Import data
// node seeder -i
// # Destroy data
// node seeder -d
