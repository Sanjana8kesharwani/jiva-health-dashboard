import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route('/:id')
  .get(protect, getOrderById);

router.patch('/:id/status', protect, authorize('Admin', 'Nurse'), updateOrderStatus);

export default router;
