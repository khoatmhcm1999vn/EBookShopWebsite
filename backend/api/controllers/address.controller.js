import UserAddress from "../models/address.model.js";
import expressAsyncHandler from "express-async-handler";

export const addAddress = expressAsyncHandler(async (req, res) => {
  const { payload } = req.body;
  let address = null;
  if (payload.address) {
    if (payload.address._id) {
      try {
        address = await UserAddress.findOneAndUpdate(
          { user: req.user._id, "address._id": payload.address._id },
          {
            $set: {
              "address.$": payload.address,
            },
          }
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "👎 Có lỗi xảy ra khi lưu vào trong database!",
          error,
        });
      }
      if (address) {
        res.status(201).json({
          success: true,
          message: "👍 Cập nhật thành công!",
          address,
        });
      }
    } else {
      try {
        address = await UserAddress.findOneAndUpdate(
          { user: req.user._id },
          {
            $push: {
              address: payload.address,
            },
          },
          { new: true, upsert: true }
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "👎 Có lỗi xảy ra khi lưu vào trong database!",
          error,
        });
      }
      if (address) {
        res.status(201).json({
          success: true,
          message: "👍 Thêm mới thành công!",
          address,
        });
      }
    }
  } else {
    res.status(400).json({
      success: false,
      message: "👎 Không tìm thấy!",
      error: "Params address required",
    });
  }
});

export const getAddress = expressAsyncHandler(async (req, res) => {
  let { _id } = req.user;
  let userAddress = null;
  try {
    userAddress = await UserAddress.findOne({ user: _id }, { __v: 0 }).populate(
      "user",
      "select firstName phone_number"
    );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "👎 Không tìm thấy!", error });
    return;
  }
  if (userAddress === null) {
    res.status(400).json({
      data: [],
      success: false,
      message: "👎 Address không tồn tại!",
    });
    return;
  }
  res
    .status(200)
    .json({ success: true, message: "👍 Thành công!", userAddress });
});

export const deleteAddress = expressAsyncHandler(async (req, res, next) => {
  if (typeof req.body.id === "undefined") {
    res.status(422).json({ success: false, message: "👎 Id không tồn tại!" });
    return;
  }
  const { id } = req.body;
  let addressObj;
  let remove;
  if (id) {
    try {
      addressObj = await UserAddress.findOne({
        user: req.user._id,
        "address._id": id,
      });
      let index = addressObj.address.findIndex((element) => element._id == id);
      if (index === -1) {
        res
          .status(404)
          .json({ success: false, message: " 👎 Address không tồn tại!" });
        return;
      }
      addressObj.address.splice(index, 1);
      // console.log(addressObj);

      try {
        remove = await UserAddress.findOneAndUpdate(
          { user: req.user._id },
          {
            $set: { address: addressObj.address },
          }
        );
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "👎 Có lỗi xảy ra khi lưu vào trong database!",
        });
        return;
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "👎 Có lỗi xảy ra khi lưu vào trong database!",
      });
    }
  }

  if (remove) {
    res.status(201).json({
      success: true,
      message: "👍 Xóa thành công!",
      remove,
    });
    return;
  }
  res.json({ msg: "fail" });
  return;
});
