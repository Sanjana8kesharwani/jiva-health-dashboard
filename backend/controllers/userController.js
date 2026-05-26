import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// =========================================================================
// USER MANAGEMENT CONTROLLERS
// =========================================================================

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin, Nurse)
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { role, status, search } = req.query;
  const query = {};

  // Filters
  if (role) {
    query.role = role;
  }
  if (status) {
    query.status = status;
  }

  // Search filter (searches name, email or phone)
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin, Nurse, or Self)
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Restrict access: only Admin/Nurse, or the user themselves can retrieve their data
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this user profile');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Create a new user manually
 * @route   POST /api/users
 * @access  Private (Admin, Nurse)
 */
export const createUser = asyncHandler(async (req, res) => {
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
    isPrime,
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email address');
  }

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
    isPrime: isPrime || false,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

/**
 * @desc    Update a user
 * @route   PUT /api/users/:id
 * @access  Private (Admin, Nurse, or Self)
 */
export const updateUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Check permissions: only Admin/Nurse or self can edit user profile
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this user profile');
  }

  // Prevent Patients from updating their own role, status, or orders/spend aggregates
  const updates = { ...req.body };
  if (req.user.role === 'Patient') {
    delete updates.role;
    delete updates.status;
    delete updates.isPrime;
    delete updates.totalOrders;
    delete updates.totalSpent;
    delete updates.appointmentsCount;
  }

  // Prevent changing password through user info updates endpoint
  delete updates.password;

  user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: `User with id of ${req.params.id} has been deleted`,
    data: {},
  });
});

/**
 * @desc    Upgrade user to Prime
 * @route   PATCH /api/users/:id/prime
 * @access  Private (Admin, Nurse, or Self)
 */
export const upgradePrime = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Check permissions
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to upgrade this user to Prime');
  }

  const { isPrime } = req.body;
  user.isPrime = typeof isPrime === 'boolean' ? isPrime : !user.isPrime;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User Prime status updated to ${user.isPrime}`,
    data: {
      _id: user._id,
      fullName: user.fullName,
      isPrime: user.isPrime,
    },
  });
});

/**
 * @desc    Toggle active/inactive status
 * @route   PATCH /api/users/:id/status
 * @access  Private (Admin, Nurse)
 */
export const toggleStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  const { status } = req.body;
  if (status && !['Active', 'Inactive'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Status must be either Active or Inactive.');
  }

  user.status = status || (user.status === 'Active' ? 'Inactive' : 'Active');
  await user.save();

  res.status(200).json({
    success: true,
    message: `User status updated to ${user.status}`,
    data: {
      _id: user._id,
      fullName: user.fullName,
      status: user.status,
    },
  });
});

// =========================================================================
// ADDRESS SUBDOCUMENT CONTROLLERS
// =========================================================================

/**
 * @desc    Add address to user profile
 * @route   POST /api/users/:id/addresses
 * @access  Private (Admin, Nurse, or Self)
 */
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Check permissions
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this profile addresses');
  }

  const { type, addressLine, city, state, pincode, isDefault } = req.body;

  // Validate fields
  if (!addressLine || !city || !state || !pincode) {
    res.status(400);
    throw new Error('Please enter all address details');
  }

  const defaultSetting = isDefault || user.addresses.length === 0;

  // If new address is default, unset previous default addresses
  if (defaultSetting) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.addresses.push({
    type: type || 'Home',
    addressLine,
    city,
    state,
    pincode,
    isDefault: defaultSetting,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: user.addresses,
  });
});

/**
 * @desc    Update an address
 * @route   PUT /api/users/:id/addresses/:addressId
 * @access  Private (Admin, Nurse, or Self)
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Check permissions
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this profile addresses');
  }

  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error(`Address not found with id of ${req.params.addressId}`);
  }

  const { type, addressLine, city, state, pincode, isDefault } = req.body;

  // Handle default address rules
  if (isDefault === true) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
    address.isDefault = true;
  } else if (isDefault === false && address.isDefault) {
    // Cannot unset default if it is the only address
    if (user.addresses.length > 1) {
      address.isDefault = false;
      // Set the first other address as default
      const alternate = user.addresses.find((addr) => addr._id.toString() !== address._id.toString());
      if (alternate) alternate.isDefault = true;
    }
  }

  // Update fields
  if (type) address.type = type;
  if (addressLine) address.addressLine = addressLine;
  if (city) address.city = city;
  if (state) address.state = state;
  if (pincode) address.pincode = pincode;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: user.addresses,
  });
});

/**
 * @desc    Delete an address
 * @route   DELETE /api/users/:id/addresses/:addressId
 * @access  Private (Admin, Nurse, or Self)
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Check permissions
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this profile addresses');
  }

  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error(`Address not found with id of ${req.params.addressId}`);
  }

  const wasDefault = address.isDefault;

  // Remove the address
  user.addresses.pull({ _id: req.params.addressId });

  // If default address was deleted, set default to the first remaining address
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
    data: user.addresses,
  });
});

/**
 * @desc    Set default address
 * @route   PATCH /api/users/:id/addresses/:addressId/default
 * @access  Private (Admin, Nurse, or Self)
 */
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Check permissions
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this profile addresses');
  }

  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error(`Address not found with id of ${req.params.addressId}`);
  }

  // Set all to false, then current to true
  user.addresses.forEach((addr) => {
    addr.isDefault = false;
  });
  address.isDefault = true;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Default address updated successfully',
    data: user.addresses,
  });
});

// =========================================================================
// FAMILY MEMBER SUBDOCUMENT CONTROLLERS
// =========================================================================

/**
 * @desc    Add family member
 * @route   POST /api/users/:id/family
 * @access  Private (Admin, Nurse, or Self)
 */
export const addFamilyMember = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Check permissions
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this profile family members');
  }

  const { name, relationship, dob, phone } = req.body;

  if (!name || !relationship) {
    res.status(400);
    throw new Error('Please add name and relationship');
  }

  user.familyMembers.push({
    name,
    relationship,
    dob,
    phone,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'Family member added successfully',
    data: user.familyMembers,
  });
});

/**
 * @desc    Edit family member details
 * @route   PUT /api/users/:id/family/:memberId
 * @access  Private (Admin, Nurse, or Self)
 */
export const editFamilyMember = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Check permissions
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this profile family members');
  }

  const member = user.familyMembers.id(req.params.memberId);
  if (!member) {
    res.status(404);
    throw new Error(`Family member not found with id of ${req.params.memberId}`);
  }

  const { name, relationship, dob, phone } = req.body;

  if (name) member.name = name;
  if (relationship) member.relationship = relationship;
  if (dob) member.dob = dob;
  if (phone) member.phone = phone;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Family member updated successfully',
    data: user.familyMembers,
  });
});

/**
 * @desc    Delete family member
 * @route   DELETE /api/users/:id/family/:memberId
 * @access  Private (Admin, Nurse, or Self)
 */
export const deleteFamilyMember = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Check permissions
  if (req.user.role === 'Patient' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this profile family members');
  }

  const member = user.familyMembers.id(req.params.memberId);
  if (!member) {
    res.status(404);
    throw new Error(`Family member not found with id of ${req.params.memberId}`);
  }

  user.familyMembers.pull({ _id: req.params.memberId });

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Family member deleted successfully',
    data: user.familyMembers,
  });
});
