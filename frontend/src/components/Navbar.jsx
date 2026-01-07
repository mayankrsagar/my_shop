"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { FocusTrap } from "focus-trap-react";
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
  const isMountedRef = useRef(true);

  const lastToggleRef = useRef(0);
  const OPEN_CLOSE_GUARD_MS = 500;

  const openSheet = useCallback((evt) => {
    evt?.stopPropagation?.();
    lastToggleRef.current = Date.now();
    setOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    lastToggleRef.current = Date.now();
    setOpen(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // body scroll lock + save/restore focus
  useEffect(() => {
    if (!open) {
      try {
        prevFocus.current?.focus?.();
      } catch {}
      return;
    }
    prevFocus.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (!isMountedRef.current) return;
      document.body.style.overflow = prevOverflow || "";
      try {
        prevFocus.current?.focus?.();
      } catch {}
    };
  }, [open]);

  // keyboard ESC closes sheet
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") closeSheet();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeSheet]);

  // Closes sheet on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        closeSheet();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open, closeSheet]);

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
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 min-w-0">
              <Link href="/" className="flex items-center space-x-2 shrink-0">
                <div className="relative">
                  <HiSparkles className="text-xl sm:text-2xl md:text-3xl text-yellow-400" />
                  <div className="absolute inset-0 text-2xl text-yellow-400 opacity-40 blur-sm pointer-events-none" />
                </div>
                <span className="text-sm sm:text-base md:text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent truncate">
                  🌸 BuyBloom
                </span>
              </Link>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 overflow-x-auto max-w-[50%] lg:max-w-[60%] scrollbar-hide">
              {navItems
                .filter((i) => i.visible)
                .map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center whitespace-nowrap text-sm sm:text-base lg:text-base text-purple-700 dark:text-gray-200 hover:text-purple-900 transition px-1 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex">
                <ThemeToggle />
              </div>

              {user && (
                <Link href="/favorites" className="hidden md:inline-block">
                  <div className="relative p-2 sm:p-2.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:bg-black/20 hover:scale-105 transition">
                    <FaHeart className="text-lg sm:text-xl text-red-400" />
                  </div>
                </Link>
              )}

              <Link href="/cart" className="relative">
                <div className="relative p-2.5 sm:p-3 rounded-full bg-slate-700 hover:bg-slate-600 transition transform-gpu">
                  <FaShoppingCart className="text-lg sm:text-xl md:text-2xl text-slate-50" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cyan-400 text-slate-900 text-[10px] sm:text-xs md:text-sm font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-6 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <>
                    <Link href="/profile">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                        <FaUser className="text-blue-400 text-sm sm:text-base" />
                        <span className="text-xs sm:text-sm text-white font-medium max-w-[8rem] truncate">
                          {user.name}
                        </span>
                        <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {user.role}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={logout}
                      className="px-3 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-3 py-2 rounded-full bg-slate-700 text-slate-50 text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="hidden sm:inline-block bg-violet-600 text-white px-3 py-2 rounded-full text-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (open) {
                    closeSheet();
                  } else {
                    openSheet(e);
                  }
                }}
                aria-controls="mobile-bottom-sheet"
                aria-expanded={open}
                className="ml-1 p-2 rounded-md text-slate-200 md:hidden hover:bg-slate-700 transition"
                title="Toggle menu"
                type="button"
              >
                {open ? (
                  <FaTimes className="text-lg" />
                ) : (
                  <FaBars className="text-lg" />
                )}
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
              onClick={() => {
                if (Date.now() - lastToggleRef.current < OPEN_CLOSE_GUARD_MS)
                  return;
                closeSheet();
              }}
              aria-hidden="true"
            />

            <FocusTrap
              active={open}
              focusTrapOptions={{
                clickOutsideDeactivates: false,
                escapeDeactivates: false,
                returnFocusOnDeactivate: true,
              }}
            >
              <motion.div
                key="sheet"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                id="mobile-bottom-sheet"
                className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full pointer-events-auto rounded-t-xl bg-slate-900 border border-slate-700/60 shadow-2xl flex flex-col" // ✅ Added flex layout
                variants={sheetVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                style={{
                  maxHeight: "94vh", // ✅ Increased from 88vh to 94vh
                  paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)", // ✅ More padding
                }}
              >
                {/* ✅ Add visual drag handle for better UX */}
                <div className="w-full flex justify-center pt-2 pb-1">
                  <div className="h-1 w-12 rounded-full bg-slate-600/50" />
                </div>

                {/* ✅ Header - stays fixed */}
                <div className="w-full flex items-center justify-between px-4 py-3 flex-shrink-0">
                  <Link
                    href="/"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeSheet();
                    }}
                    className="flex items-center gap-2"
                  >
                    <HiSparkles className="text-2xl text-yellow-400" />
                    <span className="text-base font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                      BuyBloom
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeSheet();
                      }}
                      aria-label="Close"
                      className="p-2 text-slate-200"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* ✅ Scrollable content area - expands to fill */}
                <div className="px-4 pb-6 overflow-y-auto flex-1">
                  {" "}
                  {/* ✅ Added flex-1 */}
                  <motion.nav
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2"
                  >
                    {navItems
                      .filter((i) => i.visible)
                      .map((item, idx) => (
                        <motion.div
                          key={item.label}
                          variants={itemVariants}
                          className=""
                        >
                          <Link
                            href={item.href}
                            onClick={(e) => {
                              e.stopPropagation();
                              closeSheet();
                            }}
                            className="block w-full px-4 py-3 rounded-lg text-left hover:bg-slate-800 transition"
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
                        onClick={(e) => {
                          e.stopPropagation();
                          closeSheet();
                        }}
                        className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:bg-black/20"
                      >
                        <FaHeart className="text-red-400 text-lg" />
                      </Link>
                    )}
                    <Link
                      href="/cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeSheet();
                      }}
                      className="relative p-3 rounded-lg bg-slate-700"
                    >
                      <FaShoppingCart className="text-slate-50 text-lg" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-cyan-400 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/gifts"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeSheet();
                      }}
                      className="p-3 rounded-lg bg-slate-700"
                    >
                      <FaGift className="text-lg" />
                    </Link>
                  </div>
                  <div className="mt-6 border-t border-slate-700/50 pt-4">
                    {user ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeSheet();
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
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
                          onClick={(e) => {
                            e.stopPropagation();
                            closeSheet();
                          }}
                          className="block text-center px-3 py-2 rounded bg-slate-700 text-slate-50"
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeSheet();
                          }}
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
