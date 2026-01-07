"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
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
      await login(email, password);
      toast.success('Login successful!');
      router.push("/");
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      if (err.response?.data?.details) {
        const validationErrors = {};
        err.response.data.details.forEach(detail => {
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
        <div className="glass rounded-2xl p-8 border border-white/20">
          <p className="text-white text-center">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="glass rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-white/70">Sign in to your account</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
                {errors.general}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all ${
                  errors.email ? "border-red-400/50" : "border-white/20"
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-300">{errors.email}</p>
              )}
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className={`w-full px-4 py-3 pr-12 bg-white/10 border rounded-lg text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all ${
                  errors.password ? "border-red-400/50" : "border-white/20"
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-11 text-white/60 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-300">{errors.password}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            
            <div className="text-center pt-4">
              <p className="text-white/70 mb-2">
                Don't have an account?{" "}
                <Link href="/signup" className="text-purple-300 hover:text-purple-200 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
              <Link href="/forgot-password" className="text-purple-300 hover:text-purple-200 text-sm transition-colors">
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}