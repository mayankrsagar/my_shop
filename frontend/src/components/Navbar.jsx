"use client";
import { useEffect, useRef, useState } from "react";

import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  FaBars,
  FaGift,
  FaHeart,
  FaShoppingCart,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

/* Framer variants */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
};
const sheetVariants = {
  hidden: { y: "100%", transition: { ease: "easeInOut", duration: 0.28 } },
  visible: {
    y: 0,
    transition: { type: "spring", damping: 28, stiffness: 220 },
  },
};
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.22 },
  },
};

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const prevFocus = useRef(null);

  const openSheet = () => setOpen(true);
  const closeSheet = () => setOpen(false);

  // body scroll lock + save/restore focus
  useEffect(() => {
    if (!open) {
      // restore focus after closing
      try {
        prevFocus.current?.focus?.();
      } catch {}
      return;
    }

    prevFocus.current = document.activeElement;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevOverflow || "";
      try {
        prevFocus.current?.focus?.();
      } catch {}
    };
  }, [open]);

  // keyboard ESC closes sheet (focus-trap would also by default handle ESC if enabled; we keep this to be explicit)
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") closeSheet();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const navItems = [
    { label: "Home", href: "/", icon: "🏠", visible: true },
    {
      label: "Donate",
      href: "/donate",
      icon: <FaHeart className="inline text-red-400 mr-2" />,
      visible: true,
    },
    {
      label: "Admin",
      href: "/admin",
      icon: "🛡️",
      visible: user?.role === "admin",
    },
    {
      label: "Seller",
      href: "/seller",
      icon: "🏪",
      visible: user?.role === "seller" || user?.role === "admin",
    },
    { label: "Developer", href: "/developer", icon: "👨‍💻", visible: true },
  ];

  return (
    <>
      <nav className="bg-slate-900 sticky top-0 z-50 border-b border-slate-700/50 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative">
                  <HiSparkles className="text-2xl text-yellow-400" />
                  <div className="absolute inset-0 text-2xl text-yellow-400 opacity-40 blur-sm pointer-events-none"></div>
                </div>
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  🌸 BuyBloom
                </span>
              </Link>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="group text-purple-700 dark:text-gray-200 hover:text-purple-900 font-medium"
              >
                🏠 Home
              </Link>
              <Link
                href="/donate"
                className="group text-purple-700 dark:text-gray-200 hover:text-pink-600 font-medium flex items-center"
              >
                <FaHeart className="text-red-400 mr-1" />
                Donate
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="group text-purple-700 dark:text-gray-200 hover:text-indigo-600 font-medium flex items-center"
                >
                  🛡️ Admin
                </Link>
              )}
              {(user?.role === "seller" || user?.role === "admin") && (
                <Link
                  href="/seller"
                  className="group text-purple-700 dark:text-gray-200 hover:text-emerald-600 font-medium flex items-center"
                >
                  🏪 Seller
                </Link>
              )}
              <Link
                href="/developer"
                className="group text-purple-700 dark:text-gray-200 hover:text-violet-600 font-medium flex items-center"
              >
                👨‍💻 Developer
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex">
                <ThemeToggle />
              </div>

              {user && (
                <Link href="/favorites" className="hidden md:inline-block">
                  <div className="relative p-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:bg-black/20 hover:scale-110 transition-all">
                    <FaHeart className="text-xl text-red-400" />
                  </div>
                </Link>
              )}

              <Link href="/cart" className="relative">
                <div className="relative p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-all duration-300 hover:scale-110">
                  <FaShoppingCart className="text-xl text-slate-50" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cyan-400 text-slate-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <>
                    <Link href="/profile">
                      <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                        <FaUser className="text-blue-400" />
                        <span className="text-white font-medium">
                          {user.name}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {user.role}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-full bg-slate-700 text-slate-50"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-violet-600 text-white px-4 py-2 rounded-full font-semibold"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile toggle */}
              <button
                onClick={() => setOpen((s) => !s)}
                aria-controls="mobile-bottom-sheet"
                aria-expanded={open}
                className="ml-1 p-2 rounded-md text-slate-200 md:hidden hover:bg-slate-700 transition"
                title="Toggle menu"
              >
                {open ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom-sheet + focus-trap + framer-motion */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 md:hidden bg-black/50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeSheet}
              aria-hidden="true"
            />

            {/* Sheet (focus-trap active) */}
            <FocusTrap
              active={open}
              focusTrapOptions={{
                onDeactivate: closeSheet,
                clickOutsideDeactivates: true,
                escapeDeactivates: true,
              }}
            >
              <motion.div
                key="sheet"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                id="mobile-bottom-sheet"
                className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg rounded-t-xl bg-slate-900 border border-slate-700/60 shadow-2xl pointer-events-auto"
                variants={sheetVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{ maxHeight: "80vh" }}
              >
                <div className="w-full flex items-center justify-between p-3">
                  <Link
                    href="/"
                    onClick={closeSheet}
                    className="flex items-center space-x-2"
                  >
                    <HiSparkles className="text-2xl text-yellow-400" />
                    <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                      BuyBloom
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                      onClick={closeSheet}
                      aria-label="Close"
                      className="p-2 text-slate-200"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="px-5 pb-6 overflow-y-auto">
                  <motion.nav
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {navItems
                      .filter((i) => i.visible)
                      .map((item, idx) => (
                        <motion.div
                          key={item.label}
                          variants={itemVariants}
                          className="rounded-lg"
                        >
                          <Link
                            href={item.href}
                            onClick={closeSheet}
                            className="block w-full px-4 py-3 rounded-lg text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{item.icon}</span>
                              <span className="font-medium text-white">
                                {item.label}
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                  </motion.nav>

                  <div className="mt-5 flex items-center gap-3">
                    {user && (
                      <Link
                        href="/favorites"
                        onClick={closeSheet}
                        className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:bg-black/20"
                      >
                        <FaHeart className="text-red-400" />
                      </Link>
                    )}
                    <Link
                      href="/cart"
                      onClick={closeSheet}
                      className="relative p-3 rounded-lg bg-slate-700"
                    >
                      <FaShoppingCart className="text-slate-50" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-cyan-400 text-slate-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/gifts"
                      onClick={closeSheet}
                      className="p-3 rounded-lg bg-slate-700"
                    >
                      <FaGift />
                    </Link>
                  </div>

                  <div className="mt-6 border-t border-slate-700/50 pt-4">
                    {user ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={closeSheet}
                          className="block px-3 py-2 rounded hover:bg-slate-800"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaUser className="text-blue-400" />
                              <div>
                                <div className="font-medium text-white">
                                  {user.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {user.role}
                            </span>
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            closeSheet();
                          }}
                          className="w-full text-left px-3 py-2 rounded bg-gradient-to-r from-red-500 to-pink-500 text-white mt-2"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/login"
                          onClick={closeSheet}
                          className="block text-center px-3 py-2 rounded bg-slate-700 text-slate-50"
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          onClick={closeSheet}
                          className="block text-center px-3 py-2 rounded bg-violet-600 text-white"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-xs text-gray-400">
                    Tip: press Escape to close, or tap outside the sheet.
                  </div>
                </div>
              </motion.div>
            </FocusTrap>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
