import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} from '../controllers/orderController.js';

import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (support both authenticated and guest users)
router.post('/', optionalAuth, createOrder); // Create order (auth optional)
router.get('/', optionalAuth, getOrders); // Get user's orders or guest orders
router.get('/:id', optionalAuth, getOrder); // Get single order
router.put('/:id/cancel', optionalAuth, cancelOrder); // Cancel order (owner only)

// Admin/Kitchen routes
router.get('/admin/all', protect, authorize('admin', 'kitchen'), getAllOrders);
router.put('/:id/status', protect, authorize('admin', 'kitchen'), updateOrderStatus);

export default router;
