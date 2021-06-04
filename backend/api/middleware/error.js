import HttpError from "http-errors";

// const unknownEndpoints = () => {
//   const error = new HttpError("Unknown Endpoints", 404);
//   // error.status = 404;
//   // console.log(error.message);
//   throw error;
// };

const errorHandler = (err, req, res, next) => {
  //Mongoose Bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).send({
      status: "Error",
      error: `Resource is not found`,
    });
  }

  //Mongoose validation Error
  if (err.name === "ValidationError") {
    console.log(err);
    const message = Object.values(err.errors).map((val) => val.message);
    const arrayIntoString = message.join(",");
    return res.status(400).send({ status: "Error", error: arrayIntoString });
  }

  //Mongoose Dublicat key
  if (err.code === 11000) {
    return res
      .status(409)
      .send({ status: "Error", error: "Dublicate value entered" });
  }

  // console.log("Error status: ", err.status);
  // console.log("Message: ", err.message);
  // res.status(err.status || 500);
  res
    .status(err.status || 500)
    .json({ status: err.status || 500, error: err.message, stack: err.stack });
};

const error = {
  // unknownEndpoints,
  errorHandler,
};
export default error;
