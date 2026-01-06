"use client";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import Modal from "./Modal";

export default function RatingModal({ product, isOpen, onClose, onRatingSubmitted }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: product._id,
          rating,
          review
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit rating');
      }
      
      onRatingSubmitted();
      onClose();
      setRating(0);
      setReview("");
    } catch (err) {
      setErrorModal({ isOpen: true, message: err.message || "Error submitting rating" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Rate this product</h3>
        <div className="text-center mb-4">
          <h4 className="font-semibold text-gray-800">{product.name}</h4>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <div className="flex justify-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  <FaStar className={star <= rating ? "text-yellow-400" : "text-gray-300"} />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">Click to rate</p>
          </div>
          
          <textarea
            placeholder="Write a review (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!rating || isSubmitting}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        type="error"
        title="Rating Error"
        message={errorModal.message}
      />
    </div>
  );
}