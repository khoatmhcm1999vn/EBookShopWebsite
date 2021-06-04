"use strict";

const isValidObjId = (ID) => {
  const pattern = /^[a-fA-F0-9]{24}$/;
  return pattern.test(ID);
};

const isValidFile = (file) => {
  if (
    file.mimetype !== "image/png" &&
    file.mimetype !== "image/jpeg" &&
    file.mimetype !== "image/jpg"
  ) {
    return false;
  }
  return true;
};

const validator = {
  isValidObjId,
  isValidFile,
};
export default validator;
// module.exports = {
//   isValidObjId,
//   isValidFile,
// };
