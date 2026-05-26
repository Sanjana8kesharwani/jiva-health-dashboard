import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    role,
    avatar,
    bloodGroup,
    gender,
    dob,
  } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email address');
  }

  // Create new user (password is hashed in pre-save hook)
  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    role: role || 'Patient',
    avatar: avatar || '',
    bloodGroup,
    gender,
    dob,
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isPrime: user.isPrime,
        avatar: user.avatar,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        dob: user.dob,
        joinedDate: user.joinedDate,
        token: generateToken(user._id, user.role),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for email and password input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  // Find user and select password (as it is excluded by default)
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    // Update lastActive
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isPrime: user.isPrime,
        avatar: user.avatar,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        dob: user.dob,
        joinedDate: user.joinedDate,
        token: generateToken(user._id, user.role),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Get current logged in user details
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
