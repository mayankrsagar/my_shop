"use client";
import Link from 'next/link';
import {
  FaDev,
  FaGithub,
  FaHeart,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-white/20">
      <div className="container mx-auto px-6 py-8">
        {/* glass-like background wrapper to ensure contrast in both modes */}
        <div className="w-full rounded-xl p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <HiSparkles className="text-2xl text-yellow-400" />
                {/* Gradient on light mode, solid white in dark mode */}
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent dark:text-white">
                  BuyBloom
                </span>
              </div>
              <p className="text-gray-700 dark:text-white/70 text-sm">
                Building the future of e-commerce with community support and
                magical experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-white font-semibold">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/donate"
                  className="block text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                >
                  Donate
                </Link>
                <Link
                  href="/favorites"
                  className="block text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                >
                  Favorites
                </Link>
                <Link
                  href="/cart"
                  className="block text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                >
                  Cart
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-white font-semibold">
                Legal
              </h3>
              <div className="space-y-2">
                <Link
                  href="/privacy"
                  className="block text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="block text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/refund"
                  className="block text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                >
                  Refund Policy
                </Link>
                <Link
                  href="/shipping"
                  className="block text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                >
                  Shipping Policy
                </Link>
              </div>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-white font-semibold">
                Connect
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/mayankrsagar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FaGithub className="text-xl" />
                </a>
                <a
                  href="https://x.com/mayankrsagar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a
                  href="https://www.linkedin.com/in/mayank-sagar-mern/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FaLinkedin className="text-xl" />
                </a>
                <a
                  href="https://dev.to/mayankrsagar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FaDev className="text-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 dark:border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-white/70 text-sm flex items-center">
              © {new Date().getFullYear()} BuyBloom. Made with
              <FaHeart className="inline text-red-400 mx-1" /> for the
              community.
            </p>
            <p className="text-gray-600 dark:text-white/70 text-sm">
              Powered by Next.js & Node.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
