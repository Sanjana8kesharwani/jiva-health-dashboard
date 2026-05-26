/**
 * Fallback Not Found Middleware for handling non-existent endpoints
 */
const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Not Found - API endpoint [${req.method}] ${req.originalUrl} does not exist`);
  res.status(404);
  next(error);
};

export default notFoundMiddleware;
