"use client";
import Link from "next/link";
import { FaShoppingCart, FaUser } from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          ShopApp
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className="hover:text-blue-500">
              Admin
            </Link>
          )}
          {(user?.role === 'seller' || user?.role === 'admin') && (
            <Link href="/seller" className="hover:text-blue-500">
              Seller
            </Link>
          )}
          <Link
            href="/cart"
            className="relative flex items-center hover:text-blue-500"
          >
            <FaShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hover:text-blue-500">
                Profile
              </Link>
              <span className="text-sm">
                <FaUser className="inline mr-1" />
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-blue-500">
                Login
              </Link>
              <Link href="/signup" className="hover:text-blue-500">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}