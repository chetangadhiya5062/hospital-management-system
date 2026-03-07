const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  if (err.code === 11000) {
    return res.status(409).json({
      status: "fail",
      message: "This slot is already booked. Please choose another time."
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error"
  });
};

module.exports = errorMiddleware;