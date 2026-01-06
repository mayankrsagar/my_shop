import User from "../models/User.js";
import Product from "../models/Product.js";

export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isFavorite = user.favorites.includes(productId);
    
    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== productId);
    } else {
      user.favorites.push(productId);
    }

    await user.save();

    res.json({
      success: true,
      message: isFavorite ? "Removed from favorites" : "Added to favorites",
      isFavorite: !isFavorite
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate({
      path: 'favorites',
      populate: {
        path: 'sellerId',
        select: 'name'
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkFavoriteStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isFavorite = user.favorites.includes(productId);
    
    res.json({
      success: true,
      isFavorite
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};