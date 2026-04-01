import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';
import {
  getDashboardStats,
  getOrdersAdmin,
  updateOrderStatus,
  getProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getAllContentAdmin,
  updateContentAdmin
} from '../controllers/adminController';

const router = Router();

// Apply auth and admin middleware to all routes in this file
router.use(requireAuth);
router.use(requireAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// Orders
router.get('/orders', getOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatus);

// Products
router.get('/products', getProductsAdmin);
router.post('/products', createProductAdmin);
router.put('/products/:id', updateProductAdmin);
router.delete('/products/:id', deleteProductAdmin);

// Content
router.get('/content', getAllContentAdmin);
router.put('/content', updateContentAdmin);

export default router;
