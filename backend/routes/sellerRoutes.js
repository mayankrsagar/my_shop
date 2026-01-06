import express from 'express';
import { createProduct, getSellerProducts, updateProduct, deleteProduct, getSellerSales } from '../controllers/sellerController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateProduct, handleProductValidationErrors } from '../middleware/productValidation.js';
import { createProductLimiter, deleteProductLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/products', authenticate, authorize('seller', 'admin'), createProductLimiter, upload.single('productImage'), validateProduct, handleProductValidationErrors, createProduct);
router.get('/products', authenticate, authorize('seller', 'admin'), getSellerProducts);
router.get('/sales', authenticate, authorize('seller', 'admin'), getSellerSales);
router.put('/products/:productId', authenticate, authorize('seller', 'admin'), validateProduct, handleProductValidationErrors, updateProduct);
router.delete('/products/:productId', authenticate, authorize('seller', 'admin'), deleteProductLimiter, deleteProduct);

export default router;