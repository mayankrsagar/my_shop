import express from 'express';
import { getDashboardStats, getAllUsers, getAllProducts, getSellerStats, deleteUser } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticate, authorize('admin'), getDashboardStats);
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.get('/products', authenticate, authorize('admin'), getAllProducts);
router.get('/seller-stats', authenticate, authorize('admin'), getSellerStats);
router.delete('/users/:userId', authenticate, authorize('admin'), deleteUser);

export default router;