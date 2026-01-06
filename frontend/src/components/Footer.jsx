"use client";
import Link from "next/link";
import { FaHeart, FaGithub, FaTwitter, FaLinkedin, FaDev } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="glass mt-16 border-t border-white/20">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <HiSparkles className="text-2xl text-yellow-400" />
              <span className="text-xl font-bold gradient-text">ShopVibe</span>
            </div>
            <p className="text-white/70 text-sm">
              Building the future of e-commerce with community support and magical experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-white/70 hover:text-white text-sm transition-colors">
                Home
              </Link>
              <Link href="/donate" className="block text-white/70 hover:text-white text-sm transition-colors">
                Donate
              </Link>
              <Link href="/favorites" className="block text-white/70 hover:text-white text-sm transition-colors">
                Favorites
              </Link>
              <Link href="/cart" className="block text-white/70 hover:text-white text-sm transition-colors">
                Cart
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Legal</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-white/70 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-white/70 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="block text-white/70 hover:text-white text-sm transition-colors">
                Refund Policy
              </Link>
              <Link href="/shipping" className="block text-white/70 hover:text-white text-sm transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/mayankrsagar" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <FaGithub className="text-xl" />
              </a>
              <a href="https://x.com/mayankrsagar" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://www.linkedin.com/in/mayank-sagar-mern/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="https://dev.to/mayankrsagar" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <FaDev className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/60 text-sm">
            © 2024 ShopVibe. Made with <FaHeart className="inline text-red-400 mx-1" /> for the community.
          </p>
          <p className="text-white/60 text-sm">
            Powered by Next.js & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
}