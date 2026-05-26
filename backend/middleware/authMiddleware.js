import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';

/**
 * Protect routes - Verifies user token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecretkey');

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      if (req.user.status === 'Inactive') {
        res.status(403);
        throw new Error('Your account is currently inactive. Please contact support.');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

/**
 * Authorize roles
 * @param {...string} roles - List of allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role [${req.user ? req.user.role : 'Guest'}] is not authorized to access this resource`);
    }
    next();
  };
};
