import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    let imageUrl = image;
    
    // If file uploaded, use cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products',
        width: 400,
        height: 400,
        crop: 'fill'
      });
      imageUrl = result.secure_url;
    }
    
    const product = await Product.create({
      name,
      category,
      price,
      description,
      image: imageUrl,
      sellerId: req.user.id
    });
    
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;
    
    const product = await Product.findOneAndUpdate(
      { _id: productId, sellerId: req.user.id },
      updates,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findOneAndDelete({
      _id: productId,
      sellerId: req.user.id
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};