/**
 * Wrapper for Express route handlers to catch async errors and pass them to the next middleware
 * @param {Function} fn - Async middleware function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
