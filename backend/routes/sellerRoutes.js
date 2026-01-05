import express from 'express';
import { createProduct, getSellerProducts, updateProduct, deleteProduct } from '../controllers/sellerController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateProduct, handleProductValidationErrors } from '../middleware/productValidation.js';

const router = express.Router();

router.post('/products', authenticate, authorize('seller', 'admin'), upload.single('productImage'), validateProduct, handleProductValidationErrors, createProduct);
router.get('/products', authenticate, authorize('seller', 'admin'), getSellerProducts);
router.put('/products/:productId', authenticate, authorize('seller', 'admin'), validateProduct, handleProductValidationErrors, updateProduct);
router.delete('/products/:productId', authenticate, authorize('seller', 'admin'), deleteProduct);

export default router;