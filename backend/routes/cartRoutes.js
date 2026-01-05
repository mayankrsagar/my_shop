import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/cart', authenticate, getCart);
router.post('/cart/add', authenticate, addToCart);
router.put('/cart/item/:productId', authenticate, updateCartItem);
router.delete('/cart/item/:productId', authenticate, removeFromCart);

export default router;