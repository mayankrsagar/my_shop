"use client";
import { useState } from 'react';

import axios from 'axios';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaEnvelope,
} from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/password/request`,
        { email }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="glass rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <FaEnvelope className="mx-auto text-4xl text-purple-400 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Forgot Password?
            </h2>
            <p className="text-white/70">
              {`Enter your email and we'll send you a reset link`}
            </p>
          </div>

          {message ? (
            <div className="text-center">
              <div className="bg-green-500/20 border border-green-400/30 text-green-200 px-4 py-3 rounded-lg backdrop-blur-sm mb-6">
                {message}
              </div>
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors"
              >
                <FaArrowLeft />
                <span>Back to Login</span>
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors"
                >
                  <FaArrowLeft />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
