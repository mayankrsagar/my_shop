"use client";
import { memo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [currentProduct, setCurrentProduct] = useState(product);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, product._id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/favorites/check/${product._id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      // Just return silently, no modal needed for this case
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/favorites/${product._id}`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden card-hover max-w-sm mx-auto">
      {/* Floating Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-lg">
          <HiSparkles className="text-yellow-300 text-xs" />
          <span>NEW</span>
        </div>
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={toggleFavorite}
        disabled={loading}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 group-hover:scale-110 shadow-md"
      >
        <FaHeart className={`transition-colors text-sm ${
          isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        }`} />
      </button>

      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category & Rating */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={`text-xs ${
                i < Math.floor(currentProduct.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
              }`} />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({currentProduct.totalRatings || 0})</span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/product/${product._id}`}>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 line-clamp-2 leading-tight cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  ₹{product.price}
                </span>
                {product.discount > 0 && product.originalPrice && (
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <FaShoppingCart className="text-sm" />
            <span>Add to Cart</span>
          </button>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>In Stock</span>
            </span>
            <span>Free Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;