"use strict";
import Address from "../models/address.vn.model.js";

export const getAllCity = async (req, res) => {
  Address.find({}, (err, docs) => {
    if (err) {
      res.status(500).json({ msg: err });
      return;
    }
    let data = [];
    for (let i = 0; i < docs.length; i++) {
      data.push({ name: docs[i].city, code: docs[i].code });
    }
    res.status(200).json({ data: data });
  });
};
export const getAllDistrict = async (req, res) => {
  Address.findOne({ code: req.params.code }, (err, docs) => {
    if (err) {
      res.status(500).json({ msg: err });
      return;
    }
    let data = [];
    for (let i = 0; i < docs.district.length; i++) {
      data.push({ name: docs.district[i].name, code: docs.district[i].code });
    }
    res.status(200).json({ data: data });
  });
};
export const getAllWard = async (req, res) => {
  Address.findOne({ code: req.body.codecity }, (err, docs) => {
    if (err) {
      res.status(500).json({ msg: err });
      return;
    }
    let data = [];
    for (let i = 0; i < docs.district.length; i++) {
      if (req.body.codedistrict === docs.district[i].code) {
        res.status(200).json({ data: docs.district[i].ward });
        return;
      }
    }
  });
};
