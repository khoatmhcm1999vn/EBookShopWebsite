import UserAddress from "../models/address.model.js";
import expressAsyncHandler from "express-async-handler";

import mongoose from "mongoose";

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

export const addAddressx1 = expressAsyncHandler(async (req, res) => {
  // if (
  //   typeof req.body.city === "undefined" ||
  //   typeof req.body.district === "undefined" ||
  //   typeof req.body.ward === "undefined" ||
  //   typeof req.body.address === "undefined"
  // ) {
  //   res
  //     .status(422)
  //     .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
  //   return;
  // }
  // const { city, district, ward, address } = req.body;

  // await Book.find(
  //   { published: true, quantity: { $gte: 1 } },
  //   (error, product) => {
  //     if (error) {
  //       return res.status(400).json({
  //         error: "Could not update the product",
  //       });
  //     }
  //     if (product) {
  //       res.json({ product });
  //       console.log(product);
  //     }
  //   }
  // );

  // const ObjectId = mongoose.Types.ObjectId;
  // console.log(ObjectId.isValid(req.user._id));
  // console.log(req.user._id);

  const { payload: address } = req.body;
  // const { address, ward, district, city } = address;
  // console.log(address);

  if (
    typeof address.address.city === "undefined" ||
    typeof address.address.district === "undefined" ||
    typeof address.address.ward === "undefined" ||
    typeof address.address.address === "undefined"
  ) {
    res
      .status(422)
      .json({ success: false, message: "👎 Dữ liệu nhập vào bị lỗi!" });
    return;
  }

  if (address.address._id) {
    let addressFind;

    try {
      addressFind = await UserAddress.findById(address.address._id);
      // console.log(addressFind);
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "👎 UserAddress không tồn tại!" });
      return;
    }
    if (addressFind === null) {
      res
        .status(422)
        .json({ success: false, message: "👎 UserAddress không tồn tại!" });
      return;
    }
    addressFind.ward = address.address.ward;
    addressFind.district = address.address.district;
    addressFind.address = address.address.address;
    addressFind.city = address.address.city;
    addressFind.user = req.user._id;

    // console.log(addressFind);
    // return res.json({ msg: "fail" });

    try {
      await addressFind.save();
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "👍 Cập nhật thành công!",
      addressFind,
    });
  } else {
    const new_address = new UserAddress({
      user: req.user._id,
      city: address.address.city,
      district: address.address.district,
      ward: address.address.ward,
      address: address.address.address,
    });

    console.log(new_address);

    let updatedAddress;

    try {
      updatedAddress = await new_address.save();
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "👎 Có sự cố xảy ra khi lưu vào trong database!",
      });
      return;
    }

    console.log(
      "-------------------------------------------------------------------------------------------------------------------------------------"
    );
    // console.log(updatedAddress);

    res.status(201).json({
      success: true,
      message: "👍 Thêm mới thành công!",
      updatedAddress,
    });
  }
});

export const getAddress = expressAsyncHandler(async (req, res) => {
  let { _id } = req.user;
  let userAddress = null;
  try {
    userAddress = await UserAddress.findOne({ user: _id }, { __v: 0 }).populate(
      "user",
      "select firstName lastName phone_number ward district address city"
    );
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "👎 Không tìm thấy!", error });
    return;
  }
  if (userAddress === null) {
    res.json({
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
        _id: id,
      });
      let index = addressObj.address.findIndex((element) => element._id == id);
      if (index === -1) {
        res
          .status(404)
          .json({ success: false, message: "👎 Address không tồn tại!" });
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
