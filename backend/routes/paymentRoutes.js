import express from 'express';
import {
  getPayments,
  createPayment,
  updatePaymentStatus,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPayments)
  .post(protect, createPayment);

router.patch('/:id/status', protect, authorize('Admin', 'Nurse'), updatePaymentStatus);

export default router;
