"use client";
import {
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import DonationSuccessModal from '../../components/DonationSuccessModal';
import { useAuth } from '../../context/AuthContext';

/**
 * DonatePage:
 * - Chip + custom amount UX
 * - Confetti on successful donation (uses canvas-confetti via dynamic import)
 * - Theme-aware (uses your CSS vars)
 */

export default function DonatePage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState("");
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalCount: 0,
    recentDonations: [],
  });

  // UI state for chips
  const chips = [50, 100, 250, 500, 1000, 5000];
  const [selectedChip, setSelectedChip] = useState(null);

  useEffect(() => {
    fetchDonationStats();

    const id = setInterval(fetchDonationStats, 60000);
    return () => clearInterval(id);
  }, []);

  async function fetchDonationStats() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/donation-stats`
      );
      console.log("thisis inide the useEffect in dontaion page");
      if (!res.ok) return;
      const data = await res.json();
      console.log("this is inside the fetchDonationStats");
      console.log(data);
      setStats({
        totalAmount: Number(data.totalAmount || 0),
        totalCount: Number(data.totalCount || 0),
        recentDonations: Array.isArray(data.recentDonations)
          ? data.recentDonations
          : [],
      });
    } catch (err) {
      console.error("Failed to fetch donation stats:", err);
    }
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const validateAmount = (value) => {
    if (value === "" || value === null || value === undefined)
      return "Please enter a donation amount";
    const str = String(value).trim();
    if (!str) return "Please enter a donation amount";
    if (!/^\d+(\.\d{1,2})?$/.test(str))
      return "Please enter a valid amount (up to 2 decimal places)";
    const num = parseFloat(str);
    if (isNaN(num)) return "Please enter a valid number";
    if (num < 1) return "Minimum donation amount is ₹1";
    if (num > 100000) return "Maximum donation amount is ₹1,00,000";
    return "";
  };

  const handleAmountChange = (value) => {
    // allow only numbers and dot; remove leading zeros except "0." case
    let v = String(value).replace(/[^0-9.]/g, "");
    // avoid multiple dots
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
    // strip leading zeros
    if (/^0\d+/.test(v)) v = String(Number(v));
    setAmount(v);
    setSelectedChip(null); // clear chip selection when user types custom
    setError(validateAmount(v));
  };

  const handleChipSelect = (n) => {
    setSelectedChip(n);
    setAmount(String(n));
    setError("");
  };

  // Confetti launcher (dynamic import). If canvas-confetti not installed, skip silently.
  const launchConfetti = async () => {
    try {
      const confettiModule = await import("canvas-confetti");
      const confetti = confettiModule.default || confettiModule;
      // burst + spread
      confetti({
        particleCount: 160,
        spread: 120,
        origin: { y: 0.6 },
        colors: ["#34D399", "#60A5FA", "#7C3AED", "#F472B6", "#F59E0B"],
      });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.4 },
        colors: ["#34D399", "#60A5FA", "#7C3AED"],
      });
    } catch (err) {
      // silently ignore if canvas-confetti not present
      // console.warn('Confetti not available', err);
    }
  };

  const handleDonate = async () => {
    const vError = validateAmount(amount);
    if (vError) {
      setError(vError);
      return;
    }
    if (!user && !donorName.trim()) {
      setError("Please enter your name when donating as guest");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/donate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount: parseFloat(amount) }),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to create donation order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(data.amount * 100),
        currency: data.currency || "INR",
        name: "BuyBloom Donations",
        description: "Support our platform",
        order_id: data.orderId,
        handler: async (razorRes) => {
          try {
            const verifyPayload = {
              razorpay_order_id: razorRes.razorpay_order_id,
              razorpay_payment_id: razorRes.razorpay_payment_id,
              razorpay_signature: razorRes.razorpay_signature,
              amount: parseFloat(amount),
            };
            if (!user) {
              verifyPayload.donorName = donorName;
              verifyPayload.donorEmail = donorEmail;
            } else {
              verifyPayload.donorName = user.name;
              verifyPayload.donorEmail = user.email;
            }

            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify-donation`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(verifyPayload),
              }
            );
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok)
              throw new Error(verifyData.error || "Verification failed");

            // success: confetti + modal
            setDonatedAmount(amount);
            setShowSuccessModal(true);
            await launchConfetti();
            setAmount("");
            setSelectedChip(null);
            setDonorName("");
            setDonorEmail("");
            setError("");
            fetchDonationStats();
          } catch (err) {
            console.error("Donation verification error:", err);
            toast.error(err.message || "Verification failed");
          }
        },
        prefill: {
          name: user ? user.name : donorName,
          email: user ? user.email : donorEmail,
        },
        theme: { color: "#10b981" },
      };

      if (!window.Razorpay) {
        toast.error("Payment gateway not available. Try again later.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Donation create error:", err);
      setError(err.message || "Failed to process donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goal = 50000;
  const progress = Math.min((stats.totalAmount / goal) * 100, 100);

  // theme-aware styles
  const card = {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
  };
  const glass = {
    background: "var(--glass-bg)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: stats */}
        <aside style={card} className="rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              🌟 Community Impact
            </h2>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="font-medium">{stats.totalCount}</span> donors
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg p-4" style={glass}>
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Raised
              </div>
              <div className="mt-2 text-2xl font-extrabold gradient-text">
                {formatCurrency(Math.round(stats.totalAmount))}
              </div>
            </div>
            <div className="rounded-lg p-4" style={glass}>
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Amazing Donors
              </div>
              <div
                className="mt-2 text-2xl font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats.totalCount}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                🎯 Goal: {formatCurrency(goal)}
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {progress.toFixed(1)}%
              </div>
            </div>
            <div
              className="w-full bg-gray-200/60 dark:bg-white/6 h-3 rounded-full overflow-hidden"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <div
                className="h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg,#34D399,#60A5FA)",
                  boxShadow: "0 6px 20px rgba(99,102,241,0.08)",
                }}
              />
            </div>
          </div>

          <div>
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              💝 Recent Heroes
            </h3>
            <div className="space-y-3 max-h-72 overflow-auto pr-2">
              {stats.recentDonations.length === 0 && (
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  No donations yet — be the first!
                </div>
              )}
              {stats.recentDonations.map((d, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={glass}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <span className="font-semibold">
                        {(d.donorName || "Guest").charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {d.donorName || "Guest"}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {new Date(d.date || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ₹{Number(d.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right: donation form */}
        <main style={card} className="rounded-2xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                💖 Support BuyBloom
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Fuel development, maintenance and community features.
              </p>
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Secure • Fast • Transparent
            </div>
          </div>

          {!user && (
            <div className="rounded-lg p-4 mb-6" style={glass}>
              <h4
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Donate as Guest
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Your name *"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  minLength={2}
                  maxLength={50}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Donation Amount (INR)
            </label>

            {/* Chips row */}
            <div className="flex flex-wrap gap-3 mb-3">
              {chips.map((c) => {
                const active = selectedChip === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleChipSelect(c)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-transform ${
                      active ? "scale-105" : ""
                    }`}
                    style={{
                      background: active
                        ? "linear-gradient(90deg,#34D399,#60A5FA)"
                        : "var(--glass-bg)",
                      color: active ? "#fff" : "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    ₹{c.toLocaleString()}
                  </button>
                );
              })}
              {/* Custom amount chip */}
              <div style={{ minWidth: 160 }} className="ml-1">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Custom amount"
                  className="w-full p-2 rounded-lg"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {error && (
              <p
                className="mt-2 text-sm"
                style={{ color: "rgba(239,68,68,0.9)" }}
              >
                {error}
              </p>
            )}
          </div>

          <div className="mb-6">
            <button
              onClick={handleDonate}
              disabled={
                loading ||
                !!validateAmount(amount) ||
                (!user && !donorName.trim())
              }
              className="w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-transform transform hover:scale-[1.02] disabled:opacity-60"
              style={{
                background: "linear-gradient(90deg,#10b981,#06b6d4)",
                boxShadow: "0 12px 40px rgba(6,182,212,0.12)",
              }}
            >
              {loading
                ? "Processing..."
                : `Donate ₹${amount ? Number(amount).toLocaleString() : "0"}`}
            </button>
          </div>

          <div
            className="text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            <p className="text-sm">
              You can donate with or without an account. All payments are
              secure.
            </p>
            <p className="text-xs mt-2">Powered by Razorpay</p>
          </div>
        </main>
      </div>

      <DonationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={donatedAmount}
        donorName={user ? user.name : donorName}
      />
    </div>
  );
}
