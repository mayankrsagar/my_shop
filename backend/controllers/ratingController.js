import Rating from '../models/Rating.js';
import Product from '../models/Product.js';

export const addRating = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;
    
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'Only users can rate products' });
    }

    const existingRating = await Rating.findOne({ productId, userId: req.user.id });
    
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
      await existingRating.save();
    } else {
      await Rating.create({
        productId,
        userId: req.user.id,
        rating,
        review
      });
    }

    // Update product average rating
    const ratings = await Rating.find({ productId });
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await Product.findByIdAndUpdate(productId, {
      averageRating: avgRating,
      totalRatings: ratings.length
    });

    res.json({ message: 'Rating added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;
    const ratings = await Rating.find({ productId }).populate('userId', 'name');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};