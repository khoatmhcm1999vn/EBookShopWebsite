const express = require("express");
const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

// import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const braintreeRoutes = require("./routes/braintreeRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const initialDataRoutes = require("./routes/initialDataRoutes");

// app
const app = express();

// db
const db = require("./models");
const Role = db.role;

db.mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })

  .then((result) => {
    console.log("MongoDB connected!");
    // initial();
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

function initial() {
  Role.collection.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("Added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("Added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("Added 'admin' to roles collection");
      });
    }
  });
}

// middlewares
app.use(morgan("dev"));
/**
 * Configure the middleware.
 * bodyParser.json() returns a function that is passed as a param to app.use() as middleware
 * With the help of this method, we can now send JSON to our express application.
 */
// app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/routes/uploaded/"));
// app.use("/public", express.static(path.join(__dirname, "uploads")));
// app.use(bodyParser.urlencoded({ extended: false })); // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.json()); // parse requests of content-type - application/json
// app.use(cookieParser());
// app.use(expressValidator());

var allowedOrigins = [
  "http://localhost:4000",
  "http://localhost:3000",
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

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", addressRoutes);

// set port, listen for requests
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const Product = require("./models/productModel");
const Category = require("./models/categoryModel");

app.get("/api/product", async (req, res) => {
  try {
    await Product.find({})
      .populate("category")
      .exec(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            result: "success",
            message: "Fetch Product Successfully",
            data: data,
          });
        }
      });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});

app.get("/api/getProductX2", async (req, res) => {
  try {
    const products = await Product.find({})
      .select("_id name price quantity description imageUrl category")
      .populate({ path: "category", select: "_id name" })
      .exec();

    res.status(200).json({ products });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});

app.get("/api/getProductX2/:productId", (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId })
      // .select("_id name price quantity description imageUrl category")
      .populate({ path: "category", select: "_id name" })
      .exec((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
          res.status(200).json({ product });
        }
      });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
});

// app.get("/api/product/:id", async (req, res) => {
//   try {
//     data = await Product.findById({ _id: req.params.id })
//       .populate("Category")
//       .exec(function (err, data) {
//         if (err) {
//           console.log(err);
//         } else {
//           res.json({
//             result: "success",
//             message: "Fetch Single Product Successfully",
//             data: data,
//           });
//         }
//       });
//   } catch (err) {
//     res.json({ result: "error", message: err.msg });
//   }
// });

app.get("/api/product_getcategory", async (req, res) => {
  try {
    let data = await Category.find({})
      .select({ name: 1, _id: 1 })
      .sort({ created: -1 });
    res.json({
      result: "success",
      message: "Fetch Single Category Successfully",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.json({ result: "error", message: err.msg });
  }
});
