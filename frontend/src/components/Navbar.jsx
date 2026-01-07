"use client";
import Link from "next/link";
import { FaShoppingCart, FaUser, FaHeart, FaGift } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 sticky top-0 z-50 border-b border-slate-700/50 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <HiSparkles className="text-2xl text-yellow-400 float" />
              <div className="absolute inset-0 text-2xl text-yellow-400 opacity-50 blur-sm"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform">
              🌸 BuyBloom
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link group text-purple-700 dark:text-gray-200 hover:text-purple-900 dark:hover:text-purple-400 font-medium">
              <span className="relative">
                🏠 Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <Link href="/donate" className="nav-link group text-purple-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-red-400 font-medium">
              <span className="relative flex items-center space-x-1">
                <FaHeart className="text-red-400" />
                <span>Donate</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="nav-link group text-purple-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-400 font-medium">
                <span className="relative flex items-center space-x-1">
                  <span className="text-purple-400">🛡️</span>
                  <span>Admin</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            )}
            {(user?.role === 'seller' || user?.role === 'admin') && (
              <Link href="/seller" className="nav-link group text-purple-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-green-400 font-medium">
                <span className="relative flex items-center space-x-1">
                  <span className="text-green-400">🏪</span>
                  <span>Seller</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            )}
            <Link href="/developer" className="nav-link group text-purple-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-purple-400 font-medium">
              <span className="relative flex items-center space-x-1">
                <span className="text-purple-400">👨‍💻</span>
                <span>Developer</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Favorites */}
            {user && (
              <Link href="/favorites" className="relative group">
                <div className="relative p-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:bg-black/20 hover:from-purple-200 hover:to-pink-200 dark:hover:bg-black/30 transition-all duration-300 hover:scale-110 shadow-md">
                  <FaHeart className="text-xl text-red-400" />
                </div>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative group">
              <div className="relative p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-all duration-300 hover:scale-110">
                <FaShoppingCart className="text-xl text-slate-50" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cyan-400 text-slate-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="group">
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <FaUser className="text-blue-400" />
                    <span className="text-white font-medium">{user.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-50 font-medium transition-all duration-300 hover:scale-105">
                  Login
                </Link>
                <Link href="/signup" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}