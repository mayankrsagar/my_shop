"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/ProductCard";
import { FaHeart } from "react-icons/fa";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/favorites", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please login to view your favorites
          </h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaHeart className="text-red-500 text-3xl mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            {favorites.length} item{favorites.length !== 1 ? "s" : ""} in your favorites
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <FaHeart className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500">
              Start adding products to your favorites by clicking the heart icon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}