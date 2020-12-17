const { Order, CartItem } = require("../models/orderModel");
const { errorHandler } = require("../helpers/dbErrorHandler");

const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");
const Product = require("../models/productModel");

const db = require("../models");
const User = db.User;

const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");
var smtpTransport = require("nodemailer-smtp-transport");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("user", "_id name email")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.order = order;
      next();
    });
};

// your create order method with email capabilities
// exports.createOrder = (req, res) => {};

exports.getOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name address")
    .sort("-createdAt")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.status(201).json(orders);
    });
};

exports.getOrdersByValue = (req, res) => {
  Order.find()
    .populate("user", "_id name address")
    .sort("-createdAt")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.status(201).json(orders);
    });

  //   res.status(200).json({
  //     message: "Fetched orders success",
  //     orders: orders,
  //   });
  // } catch (err) {
  //   if (!err.statusCode) {
  //     err.statusCode = 500;
  //   }
  //   next(err);
  // }
};

exports.getStatusValues = (req, res) => {
  res.status(201).json(Order.schema.path("paymentStatus").enumValues);
};

exports.updateOrderStatus = (req, res) => {
  // console.log(req.order);
  // console.log(userName);
  // console.log(userEmail);
  // console.log(orderStatus);
  // const orderStatus = req.order.paymentStatus;
  // const oId = req.body._id;
  // var singleOrder = await Order.findById(oId, (err, product) => {
  //   // if (err || !user) {
  //   //   return res.status(400).json({
  //   //     error: "User not found. Please sign in or sign up!",
  //   //   });
  //   // }
  //   const des = product;
  //   // console.log(user.description);
  //   // next();
  //   console.log(des);
  //   return des;
  // }).then((data) => {
  //   return data;
  // });
  // console.log(singleOrder);
  // return res.status(401).json({ error: "message is failed!" });

  // console.log(req.order);

  Order.update(
    { _id: req.body.orderId },
    { $set: { paymentStatus: req.body.paymentStatus } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.status(201).json(order);

      const userName = req.order.user.name;
      const userEmail = req.order.user.email;
      const transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.PASSWORD,
          },
          tls: { rejectUnauthorized: false },
        })
      );
      // <h2>Transaction ID: ${order.transaction_id}</h2>
      const emailData2 = {
        to: userEmail,
        from: process.env.EMAIL_FROM,
        subject: `You order is in ${req.body.paymentStatus}`,
        html: `
      <h1>Hey ${userName}, Thank you for shopping with us.</h1>
      `,
      };

      transporter.sendMail(emailData2, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  );
};

exports.updateOrderX1 = async (req, res) => {
  // const { orderId } = req.body;
  // // console.log(orderId);
  // var singleProductx1 = await Order.findOne(
  //   { _id: req.body.orderId },
  //   (err, product) => {
  //     // if (err || !user) {
  //     //   return res.status(400).json({
  //     //     error: "User not found. Please sign in or sign up!",
  //     //   });
  //     // }
  //     const des = product;
  //     // console.log(user.description);
  //     // next();
  //     // console.log(des);
  //     return des;
  //   }
  // )
  // .populate("user", "_id name email")
  //   .then((data) => {
  //     return data;
  //   });
  // // console.log(singleProductx1);
  // const userName = singleProductx1.user.name;
  // const userEmail = singleProductx1.user.email;
  // // console.log(userName);
  // // return res.status(401).json("fail");

  Order.updateOne(
    { _id: req.body.orderId, "orderStatus.type": req.body.type },
    {
      $set: {
        "orderStatus.$": [
          { type: req.body.type, date: new Date(), isCompleted: true },
        ],
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      res.status(201).json({ order });

      //   const userName = req.order.user.name;
      //   const userEmail = req.order.user.email;
      //   const transporter = nodemailer.createTransport(
      //     smtpTransport({
      //       service: "gmail",
      //       host: "smtp.gmail.com",
      //       auth: {
      //         user: process.env.EMAIL_FROM,
      //         pass: process.env.PASSWORD,
      //       },
      //       tls: { rejectUnauthorized: false },
      //     })
      //   );
      //   // <h2>Transaction ID: ${order.transaction_id}</h2>
      //   const emailData2 = {
      //     to: userEmail,
      //     from: process.env.EMAIL_FROM,
      //     subject: `You order is in ${req.body.paymentStatus}`,
      //     html: `
      //   <h1>Hey ${userName}, Thank you for shopping with us.</h1>
      //   `,
      //   };

      //   transporter.sendMail(emailData2, function (error, info) {
      //     if (error) {
      //       console.log(error);
      //     } else {
      //       console.log("Email sent: " + info.response);
      //     }
      //   });
    }
  });
};

exports.getCustomerOrdersX1 = async (req, res) => {
  const orders = await Order.find({}).populate("items.product", "name").exec();
  res.status(200).json({ orders });
};

exports.addOrderX1 = async (req, res) => {
  var singleOrderx1 = await Cart.findOne(
    { user: req.profile._id },
    (err, order) => {
      // if (err || !user) {
      //   return res.status(400).json({
      //     error: "User not found. Please sign in or sign up!",
      //   });
      // }
      const desx = order;
      // console.log(user.description);
      // next();
      // console.log(des);
      return desx;
    }
  )
    .populate("user", "_id name email")
    .populate("cartItems.product", "_id name description price")
    .then((data) => {
      return data;
    });

  // console.log(singleOrderx1.cartItems);

  var prog = singleOrderx1.cartItems.map((p) => {
    return p;
  });
  // console.log(prog);

  // var { prgox } = singleOrderx1.cartItems;
  // console.log(prog);
  // console.log(singleOrderx1.cartItems);

  // var tlg = prog.map((p) => {
  //   return p.name;
  // });

  // console.log(tlg);
  // const productx2 = { tlg };
  // console.log(productx2);
  // // const proxId = productx2.prog._id;
  // const name = productx2.prog.name;
  // console.log(name);

  const { items } = req.body;
  // console.log(req.body.items);

  // console.log(items);

  const singleItem = items.map((item) => {
    return item.product;
  });

  // var arrayP = await Product.find(
  //   {
  //     _id: { $in: valpId },
  //   },
  //   (err, docs) => {
  //     const pro = docs;
  //     return pro;
  //   }
  // ).then((data) => {
  //   return data;
  // });
  // console.log(arrayP);

  const filAr = items.filter((e) => e.quantity <= 0);
  const filArOp = items.filter((e) => e.quantity > 0);
  // console.log(filAr);
  const pIdFil = filAr.map((c) => {
    return c.product;
  });
  // console.log(pIdFil.length);

  const arLe = pIdFil.length;
  // console.log(arLe);
  // console.log(items);

  const totalX = filAr.reduce((a, cV, cI, arr) => {
    return a + cV.payablePrice * cV.purchasedQty;
  }, 0);
  // console.log(totalX);
  // return res.status(401).json("fail");

  Cart.deleteOne({ user: req.profile._id }).exec(async (error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      // console.log(req.user._id);
      req.body.user = req.profile._id;
      req.body.orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];

      // req.body.order.user = req.profile;
      // console.log(req.body);

      var singleAddress = await Address.findOne(
        { user: req.profile._id },
        (err, product) => {
          // if (err || !user) {
          //   return res.status(400).json({
          //     error: "User not found. Please sign in or sign up!",
          //   });
          // }
          const des = product;
          // console.log(user.description);
          // next();
          // console.log(des);
          return des;
        }
      ).then((data) => {
        return data;
      });

      // console.log(singleAddress);
      var address = singleAddress.address;
      // console.log(address);

      var sinA = address.map((a) => {
        return a.address; // {0: 'one', 1: 'two'}
      });

      var sinAdr = sinA[0];
      // console.log(sinAdr);

      var singleProduct = await User.findOne(
        { _id: req.profile._id },
        (err, product) => {
          // if (err || !user) {
          //   return res.status(400).json({
          //     error: "User not found. Please sign in or sign up!",
          //   });
          // }
          const des = product;
          // console.log(user.description);
          // next();
          // console.log(des);
          return des;
        }
      ).then((data) => {
        return data;
      });
      // console.log(singleProduct);
      const productx1 = { singleProduct };
      const userId = productx1.singleProduct._id;
      const name = productx1.singleProduct.name;
      const email = productx1.singleProduct.email;
      const history = productx1.singleProduct.history;
      // console.log(name);
      // console.log(history.length);

      const lenHis = history.length;
      const order = new Order(req.body);
      order.totalAmount = order.totalAmount - totalX;
      order.items = filArOp;
      // console.log(req.body);
      // console.log(order);
      // return res.status(401).json("fail");

      const paymentStatus = order.paymentStatus;
      const paymentType = order.paymentType;
      const ordersLength = order.items.length;
      // const productName = order.items.forEach((i) => {
      //   console.log(i);
      //   return i.product;
      // });
      // console.log(productName);
      // console.log(req.body.items);
      // const pName = req.body.items;
      // console.log(pName);
      // console.log("ORDER IS JUST SAVED >>> ", paymentStatus);
      // console.log("ORDER IS JUST LENGTH >>> ", ordersLength);
      // return res.status(401).json("fail");
      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
          const transporter = nodemailer.createTransport(
            smtpTransport({
              service: "gmail",
              host: "smtp.gmail.com",
              auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.PASSWORD,
              },
              tls: { rejectUnauthorized: false },
            })
          );
          // <h2>Transaction ID: ${order.transaction_id}</h2>

          const emailData = {
            to: process.env.EMAIL_FROM, // admin
            from: process.env.EMAIL_FROM,
            subject: `A new order is received`,
            html: `
                            <h1>Hey Admin, somebody just made a purchase in your ecommerce store</h1>
                            <h2>Customer name: ${name}</h2>
                            <h2>Customer address: ${sinAdr}</h2>
                            <h2>User's purchase history: ${lenHis} purchase</h2>
                            <h2>User's email: ${email}</h2>
                            <h2>Total products: ${ordersLength}</h2>
                            <h2>Payment Type: ${paymentType}</h2>
                            <h2>Order status: ${paymentStatus}</h2>
                            <h2>Product details:</h2>
                            <hr />
                            ${prog
                              .map((p) => {
                                return `<div>
                                        <h3>Product Name: ${p.product.name}</h3>
                                        <h3>Product Price: ${p.product.price}</h3>
                                        <h3>Product Quantity: ${p.count}</h3>
                                </div>`;
                              })
                              .join("--------------------")}
                            <h2>Total order cost: ${order.totalAmount}<h2>
                            <p>Login to your dashboard</a> to see the order in detail.</p>
                        `,
          };

          res.status(201).json({ order });
          // res.status(201).json(data);

          transporter.sendMail(emailData, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          // <h2>Transaction ID: ${order.transaction_id}</h2>
          // email to buyer
          const emailData2 = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: `You order is in process`,
            html: `
                      <h1>Hey ${name}, Thank you for shopping with us.</h1>
                      <h2>Total products: ${ordersLength}</h2>
                      <h2>Order status: ${paymentStatus}</h2>
                      <h2>Product details:</h2>
                      <hr />
                      ${prog
                        .map((p) => {
                          return `<div>
                                  <h3>Product Name: ${p.product.name}</h3>
                                  <h3>Product Price: ${p.product.price}</h3>
                                  <h3>Product Quantity: ${p.count}</h3>
                          </div>`;
                        })
                        .join("--------------------")}
                      <h2>Total order cost: ${order.totalAmount}<h2>
                      <p>Thank you for shopping with us.</p>
                  `,
          };

          transporter.sendMail(emailData2, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          // console.log("ORDER IS JUST SAVED >>> ", order);
        }
      });
    }
  });
};

exports.getOrdersX1 = (req, res) => {
  Order.find({ user: req.profile._id })
    .select("_id paymentStatus paymentType orderStatus items")
    .populate("items.product", "_id name imageUrl quantity")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};

exports.getOrderX2 = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.product", "_id name imageUrl")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.profile._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};
