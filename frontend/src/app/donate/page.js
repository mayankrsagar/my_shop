"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DonationSuccessModal from "../../components/DonationSuccessModal";

export default function DonatePage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState("");
  const [stats, setStats] = useState({ totalAmount: 0, totalCount: 0, recentDonations: [] });

  useEffect(() => {
    fetchDonationStats();
  }, []);

  const fetchDonationStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/donation-stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch donation stats:', error);
    }
  };

  const validateAmount = (value) => {
    const num = parseFloat(value);
    if (!value || value.trim() === "") {
      return "Please enter a donation amount";
    }
    if (isNaN(num)) {
      return "Please enter a valid number";
    }
    if (num < 1) {
      return "Minimum donation amount is ₹1";
    }
    if (num > 100000) {
      return "Maximum donation amount is ₹1,00,000";
    }
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      return "Please enter a valid amount (up to 2 decimal places)";
    }
    return "";
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    setError(validateAmount(value));
  };

  const handleDonate = async () => {
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user && !donorName.trim()) {
      setError("Please enter your name for anonymous donation");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create donation order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: data.currency,
        name: "My Shop Donation",
        description: "Support our platform",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: parseFloat(amount)
            };

            if (!user) {
              verifyPayload.donorName = donorName;
              verifyPayload.donorEmail = donorEmail;
            }

            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify-donation`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(verifyPayload),
            });
            
            if (verifyResponse.ok) {
              setDonatedAmount(amount);
              setShowSuccessModal(true);
              setAmount("");
              setDonorName("");
              setDonorEmail("");
              setError("");
              fetchDonationStats();
            }
          } catch (error) {
            console.error('Donation verification failed:', error);
          }
        },
        prefill: {
          name: user ? user.name : donorName,
          email: user ? user.email : donorEmail,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setError(error.message || "Failed to process donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Donation Stats */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-700">🌟 Community Impact 🌟</h2>
          
          <div className="text-center mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md mb-4">
              <div className="text-3xl font-bold text-green-600">₹{stats.totalAmount.toLocaleString()}</div>
              <div className="text-gray-600">Total Raised</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-blue-600">{stats.totalCount}</div>
              <div className="text-gray-600">Amazing Donors</div>
            </div>
          </div>

          {stats.recentDonations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-center">💝 Recent Heroes</h3>
              <div className="space-y-2">
                {stats.recentDonations.map((donation, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm flex justify-between items-center">
                    <span className="font-medium">{donation.donorName}</span>
                    <span className="text-green-600 font-bold">₹{donation.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <div className="bg-yellow-100 rounded-lg p-4">
              <div className="text-lg font-semibold text-yellow-800">🎯 Goal: ₹50,000</div>
              <div className="w-full bg-yellow-200 rounded-full h-3 mt-2">
                <div 
                  className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.totalAmount / 50000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-yellow-700 mt-1">
                {((stats.totalAmount / 50000) * 100).toFixed(1)}% Complete
              </div>
            </div>
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">💖 Support Our Platform</h1>
        
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              🚀 Help us build the future of e-commerce! Your support enables:
            </p>
            <ul className="text-left space-y-2 mb-6">
              <li>🔧 Platform maintenance and updates</li>
              <li>✨ New feature development</li>
              <li>🛡️ Enhanced security measures</li>
              <li>💬 24/7 customer support</li>
            </ul>
          </div>

        <div className="space-y-6">
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-3">Donate as Guest</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    minLength="2"
                    maxLength="50"
                    pattern="[a-zA-Z\s]+"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    maxLength="100"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value.toLowerCase().trim())}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              max="100000"
              step="0.01"
              placeholder="Enter amount (minimum ₹1)"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[10, 50, 100].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAmountChange(preset.toString())}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ₹{preset}
              </button>
            ))}
          </div>

            <button
              onClick={handleDonate}
              disabled={loading || !!error || !amount || (!user && !donorName.trim())}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {loading ? "Processing..." : `🎁 Donate ₹${amount || "0"}`}
            </button>

          <div className="text-center text-sm text-gray-600">
            {user ? (
              <p>✅ Donating as {user.name}</p>
            ) : (
              <p>💝 Anyone can donate - no account required!</p>
            )}
          </div>
        </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>🔒 Secure payment powered by Razorpay</p>
            <p>✅ All donations are processed securely</p>
          </div>
        </div>
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