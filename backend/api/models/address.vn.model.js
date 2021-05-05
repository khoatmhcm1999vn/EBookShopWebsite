"use strict";
import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const addressvnSchema = new Schema({
  city: String,
  code: String,
  district: [
    {
      name: String,
      code: String,
      ward: [
        {
          name: String,
          code: String,
        },
      ],
    },
  ],
});

const AddressVn = mongoose.model("AddressVn", addressvnSchema);
export default AddressVn;
