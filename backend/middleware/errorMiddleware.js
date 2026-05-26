/**
 * Standardized Centralized Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  // Set status code (default to 500 if not set or if 200)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (!statusCode || statusCode === 200) {
    statusCode = 500;
  }

  let message = err.message;

  // Handle Mongoose Bad ObjectId cast error
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = `Resource not found with id of ${err.value}`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(', ')}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorMiddleware;
