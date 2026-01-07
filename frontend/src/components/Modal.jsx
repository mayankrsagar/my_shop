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
      
      <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-bounce-in border border-gray-200/50 dark:border-gray-700/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
        >
          <FaTimes className="text-gray-600 dark:text-gray-300" />
        </button>

        <div className={`bg-gradient-to-r ${getColors()} p-6 text-center text-white`}>
          <div className="mb-4 flex justify-center">
            {getIcon()}
          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{message}</p>
          
          {type === "confirm" ? (
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {confirmText}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className={`w-full py-3 px-6 bg-gradient-to-r ${getColors()} text-white rounded-xl font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}