import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  upgradePrime,
  toggleStatus,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  addFamilyMember,
  editFamilyMember,
  deleteFamilyMember,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// User management endpoints
router.route('/')
  .get(protect, authorize('Admin', 'Nurse'), getUsers)
  .post(protect, authorize('Admin', 'Nurse'), createUser);

router.route('/:id')
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, authorize('Admin'), deleteUser);

router.patch('/:id/prime', protect, upgradePrime);
router.patch('/:id/status', protect, authorize('Admin', 'Nurse'), toggleStatus);

// Embedded Address endpoints
router.route('/:id/addresses')
  .post(protect, addAddress);

router.route('/:id/addresses/:addressId')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.patch('/:id/addresses/:addressId/default', protect, setDefaultAddress);

// Embedded Family Member endpoints
router.route('/:id/family')
  .post(protect, addFamilyMember);

router.route('/:id/family/:memberId')
  .put(protect, editFamilyMember)
  .delete(protect, deleteFamilyMember);

export default router;
