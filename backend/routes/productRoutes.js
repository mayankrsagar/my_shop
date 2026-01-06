import express from 'express';
import { getProducts, seedProducts, getProductById, updateProduct } from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', authenticate, updateProduct);
router.post('/seed', seedProducts);

export default router;