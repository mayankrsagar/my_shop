import Product from '../models/Product.js';
import Order from '../models/Order.js';
import cloudinary from '../config/cloudinary.js';

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, originalPrice, discount, description, image, brand, tags } = req.body;
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
    
    // Calculate price based on discount
    let finalPrice = parseFloat(price);
    let finalOriginalPrice = originalPrice ? parseFloat(originalPrice) : finalPrice;
    let finalDiscount = discount ? parseFloat(discount) : 0;
    
    // If discount is provided, calculate the discounted price
    if (finalDiscount > 0) {
      if (!originalPrice) {
        finalOriginalPrice = finalPrice;
        finalPrice = finalPrice * (1 - finalDiscount / 100);
      }
    }
    
    // Parse tags if provided
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }
    
    const product = await Product.create({
      name,
      category,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      discount: finalDiscount,
      description,
      image: imageUrl,
      brand: brand || undefined,
      tags: parsedTags,
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
    const { name, category, price, originalPrice, discount, description, brand, tags } = req.body;
    
    // Calculate price based on discount if provided
    let updateData = { name, category, description };
    
    if (brand !== undefined) updateData.brand = brand || undefined;
    
    if (tags !== undefined) {
      let parsedTags = [];
      if (tags) {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }
      updateData.tags = parsedTags;
    }
    
    if (price !== undefined) {
      let finalPrice = parseFloat(price);
      let finalOriginalPrice = originalPrice ? parseFloat(originalPrice) : finalPrice;
      let finalDiscount = discount ? parseFloat(discount) : 0;
      
      if (finalDiscount > 0) {
        if (!originalPrice) {
          finalOriginalPrice = finalPrice;
          finalPrice = finalPrice * (1 - finalDiscount / 100);
        }
      }
      
      updateData.price = finalPrice;
      updateData.originalPrice = finalOriginalPrice;
      updateData.discount = finalDiscount;
    }
    
    const product = await Product.findOneAndUpdate(
      { _id: productId, sellerId: req.user.id },
      updateData,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true, product });
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

export const getSellerSales = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.sellerId': req.user.id })
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 });

    const salesData = orders.flatMap(order => 
      order.items
        .filter(item => item.sellerId.toString() === req.user.id)
        .map(item => ({
          date: order.createdAt,
          productName: item.productId.name,
          quantity: item.quantity,
          amount: item.price * item.quantity,
          orderId: order._id
        }))
    );

    const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0);
    const totalOrders = salesData.length;

    const monthlyData = salesData.reduce((acc, sale) => {
      const month = new Date(sale.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      acc[month] = (acc[month] || 0) + sale.amount;
      return acc;
    }, {});

    const dailyData = salesData
      .filter(sale => new Date(sale.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((acc, sale) => {
        const day = new Date(sale.date).toLocaleDateString();
        acc[day] = (acc[day] || 0) + sale.amount;
        return acc;
      }, {});

    res.json({
      totalSales,
      totalOrders,
      monthlyData,
      dailyData,
      recentSales: salesData.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};