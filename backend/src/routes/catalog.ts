import { Router } from 'express';
import { getCategories, getProducts, getPizzaExtras } from '../controllers/catalogController';

const router = Router();

router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/pizza-extras', getPizzaExtras);

export default router;
