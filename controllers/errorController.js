const AppError = require("../util/AppError");

const sendDevError = (err, res) => {
  console.log("Dev Error");
  return res.status(err.statusCode).json({
    msg: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  console.log("Prod Error");
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  } else {
    return res
      .status(500)
      .json({ status: "error", message: "Something went wrong..." });
  }
};

const handleCastError = (err) => {
  console.log("Cast Error!!!");
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDBError = (err) => {
  console.log("Duplicate DB Error!!!");
  const { name } = err.keyValue;
  const message = `Duplicate field name ${name}. Please provide a another value!`;
  return new AppError(message);
};

const handleJWTTokenError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleDBValidationError = (err) => {
  console.log("Validation DB Error!!!");
  const errors = err.errors;
  const messages = Object.values(errors)
    .map((err) => err.message)
    .join(",");
  return new AppError(`ERROR: ${messages}`, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastError(err);
    if (err.code === 1100) error = handleDuplicateDBError(err);
    if (err.name === "ValidationError") error = handleDBValidationError(err);
    if (err.name === "JsonWebTokenError") error = handleJWTTokenError();
    sendProdError(err, res);
  }
};
