import { Router } from 'express';
import { placeOrder, getOrders, updatePaymentStatus } from '../controllers/orderController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getOrders);
router.post('/', placeOrder);
router.post('/update-payment-status', updatePaymentStatus);

export default router;
