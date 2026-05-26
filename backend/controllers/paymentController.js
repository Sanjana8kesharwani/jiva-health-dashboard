import Payment from '../models/Payment.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get payment history
 * @route   GET /api/payments
 * @access  Private
 */
export const getPayments = asyncHandler(async (req, res) => {
  const query = {};

  // Patients can only see their own payments
  if (req.user.role === 'Patient') {
    query.userId = req.user._id;
  } else if (req.query.userId) {
    // Admin/Nurse filtering by specific user ID
    query.userId = req.query.userId;
  }

  // Filter by status if requested
  if (req.query.status) {
    query.status = req.query.status;
  }

  const payments = await Payment.find(query)
    .populate('userId', 'fullName email')
    .sort({ transactionDate: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  });
});

/**
 * @desc    Create new payment record
 * @route   POST /api/payments
 * @access  Private
 */
export const createPayment = asyncHandler(async (req, res) => {
  const { paymentId, amount, method, status } = req.body;

  if (!paymentId || !amount || !method) {
    res.status(400);
    throw new Error('Please provide paymentId, amount, and method');
  }

  // Check if payment ID already exists in records
  const paymentExists = await Payment.findOne({ paymentId });
  if (paymentExists) {
    res.status(400);
    throw new Error(`Payment record with payment ID ${paymentId} already exists`);
  }

  const payment = await Payment.create({
    userId: req.user._id, // Associated with current logged in user
    paymentId,
    amount,
    method,
    status: status || 'Pending',
  });

  res.status(201).json({
    success: true,
    message: 'Payment record created successfully',
    data: payment,
  });
});

/**
 * @desc    Update payment status
 * @route   PATCH /api/payments/:id/status
 * @access  Private (Admin, Nurse)
 */
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['Pending', 'Completed', 'Failed'].includes(status)) {
    res.status(400);
    throw new Error('Please provide a valid status (Pending, Completed, Failed)');
  }

  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error(`Payment record not found with id of ${req.params.id}`);
  }

  payment.status = status;
  await payment.save();

  res.status(200).json({
    success: true,
    message: 'Payment status updated successfully',
    data: payment,
  });
});
