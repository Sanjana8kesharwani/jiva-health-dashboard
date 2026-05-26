import Order from '../models/Order.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getOrders = asyncHandler(async (req, res) => {
  const query = {};

  // Patients can only see their own orders
  if (req.user.role === 'Patient') {
    query.userId = req.user._id;
  } else if (req.query.userId) {
    // Admin or Nurse filtering by specific userId
    query.userId = req.query.userId;
  }

  // Optional status filter
  if (req.query.orderStatus) {
    query.orderStatus = req.query.orderStatus;
  }

  const orders = await Order.find(query)
    .populate('userId', 'fullName email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'userId',
    'fullName email phone'
  );

  if (!order) {
    res.status(404);
    throw new Error(`Order not found with id of ${req.params.id}`);
  }

  // Patients can only view their own orders
  if (req.user.role === 'Patient' && order.userId._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this order');
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalAmount, paymentMethod, paymentStatus, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  if (!totalAmount || !paymentMethod || !shippingAddress) {
    res.status(400);
    throw new Error('Please provide all required order details (totalAmount, paymentMethod, shippingAddress)');
  }

  // Create order
  const order = await Order.create({
    userId: req.user._id, // Assign to logged in user
    orderItems,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentStatus || 'Pending',
    shippingAddress,
  });

  // Increment total orders count for the user
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { appointmentsCount: 1 } // Simulating an activity step or order count
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private (Admin, Nurse)
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error(`Order not found with id of ${req.params.id}`);
  }

  if (orderStatus) {
    if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(orderStatus)) {
      res.status(400);
      throw new Error('Invalid order status');
    }
    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
    }
  }

  if (paymentStatus) {
    if (!['Pending', 'Completed', 'Failed', 'Refunded'].includes(paymentStatus)) {
      res.status(400);
      throw new Error('Invalid payment status');
    }
    order.paymentStatus = paymentStatus;
  }

  await order.save(); // post-save triggers user totals update if payment status === 'Completed'

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
});
