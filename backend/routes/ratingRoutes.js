import express from 'express';
import { addRating, getProductRatings } from '../controllers/ratingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, addRating);
router.get('/:productId', getProductRatings);

export default router;