// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import jwt from "jsonwebtoken";
// const app = express();

// app.use(express.json());

// let refreshTokens = [];

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username === "khoa" && password === "abcdef1") {
//     const access_token = jwt.sign(
//       { sub: username },
//       process.env.JWT_ACCESS_SECRET,
//       { expiresIn: process.env.JWT_ACCESS_TIME }
//     );
//     const refresh_token = generateRefreshToken(username);
//     return res.json({
//       status: true,
//       message: "login success",
//       data: { access_token, refresh_token },
//     });
//   }

//   return res.status(401).json({ status: false, message: "login fail" });
// });

// app.post("/token", verifyRefreshToken, (req, res) => {
//   const username = req.userData.sub;
//   const access_token = jwt.sign(
//     { sub: username },
//     process.env.JWT_ACCESS_SECRET,
//     { expiresIn: process.env.JWT_ACCESS_TIME }
//   );
//   const refresh_token = generateRefreshToken(username);
//   return res.json({
//     status: true,
//     message: "success",
//     data: { access_token, refresh_token },
//   });
// });

// app.get("/dashboard", verifyToken, (req, res) => {
//   return res.json({ status: true, message: "Hello from dashboard." });
// });

// app.get("/logout", verifyToken, (req, res) => {
//   const username = req.userData.sub;

//   refreshTokens = refreshTokens.filter((x) => x.username !== username);
//   return res.json({ status: true, message: "success." });
// });

// app.listen(3000, () => console.log("server is running..."));
