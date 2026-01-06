"use client";
import { useEffect } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimes, FaQuestionCircle } from "react-icons/fa";

export default function Modal({ isOpen, onClose, type = "success", title, message, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) {
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

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-4xl text-green-500" />;
      case "error":
        return <FaExclamationTriangle className="text-4xl text-red-500" />;
      case "confirm":
        return <FaQuestionCircle className="text-4xl text-blue-500" />;
      default:
        return <FaCheckCircle className="text-4xl text-green-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "from-green-400 to-green-600";
      case "error":
        return "from-red-400 to-red-600";
      case "confirm":
        return "from-blue-400 to-blue-600";
      default:
        return "from-green-400 to-green-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <FaTimes className="text-gray-600" />
        </button>

        <div className={`bg-gradient-to-r ${getColors()} p-6 text-center text-white`}>
          <div className="mb-4 flex justify-center">
            {getIcon()}
          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>
          
          {type === "confirm" ? (
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                {confirmText}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className={`w-full py-3 px-6 bg-gradient-to-r ${getColors()} text-white rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}