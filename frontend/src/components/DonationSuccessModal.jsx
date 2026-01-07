"use client";
import {
  useEffect,
  useRef,
} from 'react';

import {
  FaHeart,
  FaTimes,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

/**
 * DonationSuccessModal
 * - Theme-aware using CSS variables (--card-bg, --text-primary, --text-secondary, --border-color)
 * - Accessibility: role="dialog", aria attributes, Escape to close, focus management
 * - Confetti: dynamic import of canvas-confetti (graceful if not installed)
 */

export default function DonationSuccessModal({
  isOpen,
  onClose,
  amount,
  donorName,
}) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    // toggle body scroll
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    // focus close button when opened
    if (isOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 100);
      // try confetti when modal opens
      (async () => {
        try {
          const confettiModule = await import("canvas-confetti");
          const confetti = confettiModule.default || confettiModule;
          confetti({
            particleCount: 120,
            spread: 120,
            origin: { y: 0.6 },
            colors: ["#34D399", "#60A5FA", "#7C3AED", "#F472B6", "#F59E0B"],
          });
        } catch (err) {
          // ignore if canvas-confetti not installed
        }
      })();
    }

    // ESC to close
    const onKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formattedAmount = (() => {
    try {
      const v = Number(amount ?? 0);
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(v);
    } catch {
      return `₹${amount}`;
    }
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
      aria-describedby="donation-modal-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative max-w-md w-full mx-4 overflow-hidden rounded-3xl shadow-2xl animate-bounce-in"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
        }}
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <FaTimes />
        </button>

        {/* Header (gradient) */}
        <div
          className="p-8 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#10b981,#06b6d4 50%, #7c3aed)",
            color: "#fff",
          }}
        >
          <div className="absolute inset-0 opacity-10" aria-hidden />
          <div className="relative z-10">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/20">
                  <FaHeart className="text-4xl text-red-200" />
                </div>
                <HiSparkles className="absolute -top-2 -right-2 text-yellow-200 text-2xl" />
              </div>
            </div>

            <h2 id="donation-modal-title" className="text-3xl font-bold mb-1">
              Thank you!
            </h2>
            <p id="donation-modal-desc" className="text-sm opacity-95">
              Your donation was successful and helps our community grow.
            </p>
          </div>
        </div>

        {/* Body */}
        <div
          className="p-6 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          <div className="mb-5">
            <div className="text-4xl font-extrabold text-green-600 mb-2">
              {formattedAmount}
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              donated by{" "}
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {donorName || "Guest"}
              </span>
            </p>
          </div>

          <div
            className="rounded-2xl p-5 mb-6"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <div className="flex items-center justify-center mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(90deg,#34D399,#60A5FA)",
                  color: "#fff",
                }}
              >
                🎉
              </div>
            </div>
            <h3 className="font-semibold mb-2">{`You're amazing`}</h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Your contribution helps build features, keep the platform secure,
              and support the community.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl font-semibold transition-transform transform hover:scale-[1.02] shadow-lg"
            style={{
              background: "linear-gradient(90deg,#10b981,#06b6d4)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Continue Exploring ✨
          </button>
        </div>
      </div>
    </div>
  );
}
