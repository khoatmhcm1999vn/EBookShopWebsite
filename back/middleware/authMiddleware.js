// const jwt = require("jsonwebtoken");

// const HttpError = require("../models/http-error");

// module.exports = (req, res, next) => {
//   if (req.method === "OPTIONS") {
//     return next();
//   }
//   try {
//     const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
//     if (!token) {
//       throw new Error("Authentication failed!");
//     }
//     const decodedToken = jwt.verify(token, "supersecret_dont_share");
//     req.userData = { userId: decodedToken.userId };
//     next();
//   } catch (err) {
//     const error = new HttpError("Authentication failed!", 403);
//     return next(error);
//   }

//   // const authHeader = req.get("Authorization");
//   // if (!authHeader) {
//   //   const error = new Error("Not authenticated.");
//   //   error.statusCode = 401;
//   //   throw error;
//   // }
//   // const token = authHeader.split(" ")[1];
//   // let decodedToken;
//   // try {
//   //   decodedToken = jwt.verify(token, "somesupersecretsecret");
//   // } catch (err) {
//   //   err.statusCode = 500;
//   //   throw err;
//   // }
//   // if (!decodedToken) {
//   //   const error = new Error("Not authenticated.");
//   //   error.statusCode = 401;
//   //   throw error;
//   // }
//   // req.userId = decodedToken.userId;
//   // next();
// };
