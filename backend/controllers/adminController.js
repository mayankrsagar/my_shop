import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalProducts = await Product.countDocuments();
    const totalCarts = await Cart.countDocuments();

    res.json({
      totalUsers,
      totalSellers,
      totalProducts,
      totalCarts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSellerStats = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select("name email");
    const sellerStats = await Promise.all(
      sellers.map(async (seller) => {
        const productCount = await Product.countDocuments({
          sellerId: seller._id,
        });
        return {
          seller: seller.name,
          email: seller.email,
          productCount,
        };
      })
    );
    res.json(sellerStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user's cart
    await Cart.deleteMany({ userId });

    // Delete user's products if seller
    await Product.deleteMany({ sellerId: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and associated data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
