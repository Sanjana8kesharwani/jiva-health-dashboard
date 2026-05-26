import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for a user
 * @param {string} id - The User ID
 * @param {string} role - The User's role (Patient/Nurse/Admin)
 * @returns {string} Signed JWT token
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'fallbacksecretkey',
    { expiresIn: '30d' }
  );
};

export default generateToken;
