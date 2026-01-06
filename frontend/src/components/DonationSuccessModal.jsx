"use client";
import { useEffect } from "react";
import { FaHeart, FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export default function DonationSuccessModal({ isOpen, onClose, amount, donorName }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <FaTimes className="text-gray-600" />
        </button>

        <div className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <FaHeart className="text-4xl text-red-300 animate-bounce" />
                </div>
                <HiSparkles className="absolute -top-2 -right-2 text-yellow-300 text-2xl animate-spin" />
                <HiSparkles className="absolute -bottom-1 -left-1 text-yellow-300 text-lg animate-ping" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-2">Thank You!</h2>
            <p className="text-lg opacity-90">Your donation was successful</p>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="text-4xl font-bold text-green-600 mb-2">₹{amount}</div>
            <p className="text-gray-600">
              donated by <span className="font-semibold text-gray-800">{donorName}</span>
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🎉</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">You're Amazing!</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your contribution helps us build a better platform for everyone. 
              You're now part of our incredible community of supporters!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Continue Exploring ✨
          </button>
        </div>
      </div>
    </div>
  );
}