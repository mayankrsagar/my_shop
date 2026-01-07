// Signup Page - Fixed for Dark & Light Mode
"use client";
import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 2 || name.length > 50) {
      newErrors.name = "Name must be between 2 and 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await signup(name.trim(), email, password, role);
      toast.success("Account created successfully!");
      router.push("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Signup failed";
      toast.error(errorMessage);
      if (err.response?.data?.details) {
        const validationErrors = {};
        err.response.data.details.forEach((detail) => {
          validationErrors[detail.path] = detail.msg;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 border shadow-lg">
          <p className="text-center" style={{ color: "var(--text-primary)" }}>
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="glass rounded-2xl p-8 border shadow-xl backdrop-blur-md">
          <div className="text-center mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Join BuyBloom
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Create your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Full Name
              </label>
              <input
                type="text"
                required
                className={`w-full px-4 py-3 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all ${
                  errors.name ? "border-red-400/50" : ""
                } placeholder-[var(--text-secondary)] placeholder-opacity-60`}
                style={{
                  background: "var(--glass-bg)",
                  color: "var(--text-primary)",
                  borderColor: errors.name ? undefined : "var(--border-color)",
                }}
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                className={`w-full px-4 py-3 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all ${
                  errors.email ? "border-red-400/50" : ""
                } placeholder-[var(--text-secondary)] placeholder-opacity-60`}
                style={{
                  background: "var(--glass-bg)",
                  color: "var(--text-primary)",
                  borderColor: errors.email ? undefined : "var(--border-color)",
                }}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className={`w-full px-4 py-3 pr-12 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all ${
                  errors.password ? "border-red-400/50" : ""
                } placeholder-[var(--text-secondary)] placeholder-opacity-60`}
                style={{
                  background: "var(--glass-bg)",
                  color: "var(--text-primary)",
                  borderColor: errors.password
                    ? undefined
                    : "var(--border-color)",
                }}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-11 transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Account Type
              </label>
              <select
                className="w-full px-4 py-3 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                style={{
                  background: "var(--glass-bg)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option
                  value="user"
                  className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                >
                  Customer
                </option>
                <option
                  value="seller"
                  className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                >
                  Seller
                </option>
                <option
                  value="admin"
                  className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                >
                  Admin
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-200 font-medium transition-colors underline decoration-purple-300/50"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
