"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { FaHeart, FaStar, FaShoppingCart, FaEdit } from "react-icons/fa";
import RatingModal from "../../../components/RatingModal";
import StructuredData from "../../../components/StructuredData";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { generateProductStructuredData } from "../../../lib/seo";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkFavoriteStatus();
    }
  }, [user, product]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
        setEditForm(data.product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/ratings/${id}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/favorites/check/${id}`, {
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
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/favorites/${id}`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    setEditForm(product);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        </div>
      </div>
    );
  }

  const canEdit = user && product.sellerId._id === user.id;

  const breadcrumbItems = [
    { name: product.category, href: `/?category=${encodeURIComponent(product.category)}` },
    { name: product.name }
  ];

  const productStructuredData = generateProductStructuredData(product);

  return (
    <>
      <StructuredData data={productStructuredData} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="relative">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        maxLength="100"
                        pattern="[a-zA-Z0-9\s\-_]+"
                        className="text-3xl font-bold text-gray-900 w-full border-b-2 border-purple-600 focus:outline-none"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {isEditing ? (
                          <input
                            type="text"
                            name="category"
                            value={editForm.category}
                            onChange={handleInputChange}
                            maxLength="50"
                            pattern="[a-zA-Z\s]+"
                            className="bg-transparent focus:outline-none"
                          />
                        ) : (
                          product.category
                        )}
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`text-sm ${
                            i < Math.floor(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`} />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">({product.totalRatings || 0})</span>
                        {user?.role === 'user' && (
                          <button
                            onClick={() => setShowRatingModal(true)}
                            className="text-sm text-blue-600 hover:text-blue-800 ml-3 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
                          >
                            Rate Product
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {canEdit && (
                      <button
                        onClick={isEditing ? handleSave : handleEdit}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <FaEdit />
                      </button>
                    )}
                    
                    <button
                      onClick={toggleFavorite}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <FaHeart className={`${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    {isEditing ? (
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleInputChange}
                        min="1"
                        max="1000000"
                        step="0.01"
                        className="text-4xl font-bold text-purple-600 border-b-2 border-purple-600 focus:outline-none w-32"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-purple-600">₹{product.price}</span>
                    )}
                    
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  
                  {product.discount > 0 && (
                    <span className="text-lg text-green-600 font-semibold">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleInputChange}
                      rows={4}
                      maxLength="1000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Sold by</h3>
                  <p className="text-gray-600">{product.sellerId.name}</p>
                </div>

                <div className="space-y-3">
                  {isEditing ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <FaShoppingCart />
                      <span>Add to Cart</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>In Stock</span>
                    </span>
                    <span>Free Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            
            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold">
                            {review.userId?.name?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {review.userId?.name || 'Anonymous'}
                          </h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-sm ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {review.review && (
                      <p className="text-gray-700 leading-relaxed">{review.review}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <RatingModal
            product={product}
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onRatingSubmitted={() => {
              fetchProduct();
              fetchReviews();
              setShowRatingModal(false);
            }}
          />
        </div>
      </div>
    </>
  );
}