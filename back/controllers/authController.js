// const jwt = require("jsonwebtoken"); // to generate signed token
// const expressJwt = require("express-jwt"); // for authorization check
// const User = require("../models/userModel");
// const User = require("../../models/user");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const shortid = require("shortid");
//  const formidable = require("formidable");
// const path = require("path");
// const fs = require("fs-extra");
// const { errorHandler } = require("../helpers/dbErrorHandler");
// const expressValidator = require("express-validator");
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const fetch = require("node-fetch");
// const config = require("../config/auth");

const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const expressJwt = require("express-jwt"); // for authorization check

const db = require("../models");
const User = db.User;
// const Role = db.role;

const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");
var smtpTransport = require("nodemailer-smtp-transport");

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

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  // console.log(user);
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  // console.log(req);
  if (req.profile.role === "user") {
    return res.status(403).json({
      error: "Admin resource! Access denied",
    });
  }

  next();
};

exports.activatedAccount = async (req, res) => {
  let token = req.params.token;

  if (token) {
    jsonwebtoken.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
        return res.redirect(process.env.CLIENT_URL + "login/error");
      }
    });
    let updatedFields = {
      status: "active",
      activated_token: "",
    };
    let doc = await Users.findOneAndUpdate(
      { activated_token: token },
      updatedFields
    );
    return res.redirect(process.env.CLIENT_URL + "login/success");
  }
};

exports.resetPasswordX1 = async (req, res) => {
  let expired_time = "60m";
  const { email } = req.body;
  Users.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json({
        result: "error",
        message: "User with that email does not exist",
      });
    }

    const token = generateJwtToken(user._id, user.role);

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset link`,
      html: `
                  <h1>Please use the following link to reset your password</h1>
                  <a href="http://localhost:3000/password/reset/${token}">Reset passord link</p>
                  <hr />
                  <p>This link will expired in 60 minutes</p>

              `,
    };

    user.updateOne({ resetPasswordToken: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
        return res.status(400).json({
          result: "error",
          message: "Database connection error on user password forgot request",
        });
      } else {
        transporter
          .sendMail(emailData)
          .then((response) => {
            return res.json({
              result: "success",
              message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
            });
          })
          .catch((err) => {
            return res.json({ result: "error", message: err.message });
          });
      }
    });
  });
};

exports.resetPasswordUpdate = async (req, res) => {
  const { password } = req.body;
  let resetPasswordToken = req.query.token;
  if (resetPasswordToken) {
    jsonwebtoken.verify(
      resetPasswordToken,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          return res.json({
            result: "error",
            message: "Expired link. Try again",
          });
        }
      }
    );
    let encrypt_pass = await bcrypt.hash(password, 10);
    let updatedFields = {
      hashed_password: encrypt_pass,
      resetPasswordToken: "",
    };
    await Users.findOneAndUpdate(
      { resetPasswordToken: resetPasswordToken },
      updatedFields
    ).then((responses) => {
      return res.json({
        result: "success",
        message: "Password update succesfully your can try login again",
      });
    });
  } else {
    return res.json({
      result: "error",
      message: "No Found Token",
    });
  }
};

const generateJwtToken = (_id, role) => {
  return jsonwebtoken.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.signupX2 = (req, res) => {
  User.findOne({ email: req.body.email }, async (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).json({
        message: "User already registered",
        user,
      });
      return;
    }

    // console.log("req.body", req.body);

    const { name, email, password } = req.body;
    const token = jsonwebtoken.sign({ name, email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // const { name, email, password } = req.body;
    // const _user = new User({
    //   // firstName,
    //   // lastName,
    //   name,
    //   email,
    //   hashed_password,
    //   // username: shortid.generate(),
    //   // role: "admin",
    // });
    // console.log(user);
    const hashed_password = await bcrypt.hash(password, 10);
    // const token = generateJwtToken(user._id, user.role);

    const _user = new User(req.body);

    _user.activated_token = token;
    // console.log(_user.activated_token);

    _user.hashed_password = hashed_password;

    _user.save(async (error, data) => {
      if (error) {
        res.status(400).json({
          result: "error",
          message: error.message,
          data,
        });
        return;
      }

      if (data) {
        const { _id, name, email, role } = data;

        // data.hashed_password = undefined;

        // console.log(data);

        res.status(200).json({
          message: "User created Successfully..!",
          token,
          user: { _id, name, email, role },
        });

        try {
          const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account activation link`,
            html: `
                          <h1>Please use the following link to activate your account</h1>
                          <p><a href="http://localhost:8090/api/activation/${token}">Activation link</p>
                          <hr />
                          <p>This email may contain sensetive information</p>
                          <p>and link will  expired in 365 days</p>
                      `,
          };
          const abc = await transporter.sendMail(emailData, error);
          if (abc) {
            console.log("SIGNUP EMAIL SENT", abc);
            return res.status(200).json({
              result: "success",
              message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
            });
          }
        } catch (error) {
          console.log("SIGNUP EMAIL SENT ERROR", error.message);
          return res.status(401).json({
            result: "error",
            message: error.message,
          });
        }
      } else {
        return res.status(200).json({
          message: "Fail!",
        });
      }
    });
  }).catch((err) => {
    return res.json({ result: "error", message: err.errmsg });
  });
};

// .then((sent) => {

// })
// .catch((error) => {
//   console.log("SIGNUP EMAIL SENT ERROR", error.message);
//   return res.status(401).json({
//     result: "error",
//     message: error.message,
//   });
// });

exports.signinX2 = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    // if (error) return res.status(400).json({ error });
    if (error || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please register!",
      });
    }

    // if user is found make sure the email and password match
    // create authenticate method in user model

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email or password do not match",
      });
    }
    // const { name, email } = user;
    if (user.status != "not_activated") {
      const isPassword = await user.authenticate(req.body.password);

      if (isPassword) {
        const { _id, name, email, role } = user;
        // const token = jsonwebtoken.sign({ _id, role }, process.env.JWT_SECRET, {
        //   expiresIn: "7d",
        // });
        // console.log(user);
        // console.log(token);
        // res.cookie("token", token, { expiresIn: "7d" });
        const token = jsonwebtoken.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        // persist the token as 't' in cookie with expiry date
        res.cookie("token", token, { expire: new Date() + 9999 });
        res.status(200).json({
          token,
          user: { _id, name, email, role },
          result: "success",
          message: "Login successfully",
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
      // const token = jwt.sign(
      //   { _id: user._id, role: user.role },
      //   "process.env.JWT_ACCOUNT_ACTIVATION",
      //   { expiresIn: "7d" }
      // );
    } else {
      return res.status(401).json({
        result: "error",
        message: "Your need to activate account first",
      });
    }
  });
};

exports.signoutX2 = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};
