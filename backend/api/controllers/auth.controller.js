import User from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";
import redis_client from "../../../redis_connect.js";

const Register = expressAsyncHandler(async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  try {
    const saved_user = await user.save();
    res.json({
      status: true,
      message: "Registered successfully.",
      data: saved_user,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Something went wrong.", data: error });
  }
});

async function Login(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ username, password }).exec();

    if (user === null)
      res
        .status(401)
        .json({ status: false, message: "username or password is not valid." });

    const access_token = jwt.sign(
      { sub: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refresh_token = generateRefreshToken(user._id);
    return res.json({
      status: true,
      message: "login success",
      data: { access_token, refresh_token },
    });
  } catch (error) {
    return res.status(401).json({ status: false, message: "login fail" });
  }
}

async function Logout(req, res) {
  const user_id = req.userData.sub;
  await redis_client.del(user_id.toString());
  await redis_client.set("BL_" + user_id.toString(), token);
  return res.json({ status: true, message: "success." });
}

function GetAccessToken(req, res) {
  const user_id = req.userData.sub;
  const access_token = jwt.sign(
    { sub: user_id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TIME }
  );
  const refresh_token = generateRefreshToken(user_id);
  return res.json({
    status: true,
    message: "success",
    data: { access_token, refresh_token },
  });
}

function generateRefreshToken(user_id) {
  const refresh_token = jwt.sign(
    { sub: user_id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TIME }
  );

  redis_client.get(user_id.toString(), (err, data) => {
    if (err) throw err;

    redis_client.set(
      user_id.toString(),
      JSON.stringify({ token: refresh_token })
    );
  });

  return refresh_token;
}

const authController = {
  Register,
  Login,
  Logout,
  GetAccessToken,
};
export default authController;
