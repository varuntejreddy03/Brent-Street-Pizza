import { Router } from 'express';
import { placeOrder, verifyPayment, getOrders } from '../controllers/orderController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getOrders);
router.post('/', placeOrder);
router.post('/verify-payment', verifyPayment);

export default router;
