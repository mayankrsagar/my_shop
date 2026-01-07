"use client";
import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  FaCamera,
  FaTrash,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

import Modal from '../../components/Modal';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import {
  useTheme,
} from '../../context/ThemeContext'; // adjust path if your theme context lives elsewhere

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Store original state for rollback
    const originalUserData = { name: user?.name, email: user?.email };
    const transactionId = Date.now().toString();

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/update`,
        { name, email, transactionId },
        { withCredentials: true }
      );
      await checkAuth();
      toast.success("Profile updated successfully!");
    } catch (err) {
      // Rollback form state
      setName(originalUserData.name || "");
      setEmail(originalUserData.email || "");
      
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Update transaction failed";
      toast.error(`${errorMessage} - Changes rolled back`);
      
      if (err.response?.data?.details) {
        const validationErrors = {};
        err.response.data.details.forEach((detail) => {
          validationErrors[detail.path] = detail.msg;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: errorMessage });
      }
      console.error('Profile update transaction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // client-side simple checks
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/avatar`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setAvatar(res.data.avatar);
      await checkAuth();
      toast.success("Avatar uploaded successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Error uploading avatar";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = () => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete Avatar",
      message: "Are you sure you want to delete your avatar?",
      onConfirm: async () => {
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/profile/avatar`,
            {
              withCredentials: true,
            }
          );
          setAvatar("");
          await checkAuth();
          toast.success("Avatar deleted successfully!");
        } catch (err) {
          const errorMessage =
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Error deleting avatar";
          toast.error(errorMessage);
        } finally {
          setModal((m) => ({ ...m, isOpen: false }));
        }
      },
    });
  };

  // Accept Unicode letters, marks, basic punctuation in names:
  const onNameChange = (value) => {
    // allow letters, combining marks, spaces, apostrophes, dots and hyphens
    const cleaned = value.replace(/[^\p{L}\p{M}\s'’\.\-]/gu, "");
    setName(cleaned);
  };

  // styles using your CSS variables
  const cardStyle = {
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
  };
  const glassStyle = {
    background: "var(--glass-bg)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
  };

  return (
    <ProtectedRoute>
      <div
        className="max-w-2xl mx-auto p-8 rounded-2xl shadow-xl transform transition-all duration-300"
        style={{ ...cardStyle, backdropFilter: "blur(6px)" }}
      >
        {/* Header with theme toggle */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-3xl font-bold bg-clip-text text-transparent gradient-text flex items-center gap-2"
            style={{ WebkitBackgroundClip: "text" }}
          >
            <HiSparkles className="text-2xl" />
            Profile Settings
          </h1>

          <div className="flex items-center gap-3">
            {/* <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-lg shadow-sm transition-transform transform hover:scale-105 focus:outline-none"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              {theme === "dark" ? (
                <div className="flex items-center gap-2">
                  <HiSun className="text-lg" />
                  <span className="sr-only">Light</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <HiMoon className="text-lg" />
                  <span className="sr-only">Dark</span>
                </div>
              )}
            </button> */}
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div
              className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center border-4 shadow-xl transition-transform transform group-hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                borderColor: "var(--border-color)",
              }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-4xl font-bold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
            </div>

            {/* camera bubble */}
            <label
              className="absolute -right-1 -bottom-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full cursor-pointer shadow-lg transition-transform duration-300 hover:scale-110"
              title="Upload avatar"
              style={{ boxShadow: "0 8px 30px rgba(124,58,237,0.18)" }}
            >
              <FaCamera className="text-sm" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {uploading && (
            <div className="flex items-center space-x-2 mt-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Uploading...
              </p>
            </div>
          )}

          {avatar && (
            <button
              onClick={handleDeleteAvatar}
              className="mt-3 text-sm flex items-center gap-2 px-3 py-1 rounded-lg transition-all"
              style={{
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                background: "transparent",
              }}
            >
              <FaTrash className="text-red-500" />
              <span style={{ color: "var(--text-secondary)" }}>
                Remove Avatar
              </span>
            </button>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div
              className="px-4 py-3 rounded-lg"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239,68,68,0.12)",
                color: "var(--text-primary)",
              }}
            >
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              minLength="2"
              maxLength="50"
              className={`w-full px-4 py-3 rounded-xl shadow-sm focus:outline-none transition-all`}
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
            {errors.name && (
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(239,68,68,0.85)" }}
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              maxLength="100"
              className={`w-full px-4 py-3 rounded-xl shadow-sm focus:outline-none transition-all`}
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
            {errors.email && (
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(239,68,68,0.85)" }}
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Account Role
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={user?.role?.toUpperCase() || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl shadow-sm cursor-not-allowed"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    background: "#34d399",
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(90deg,var(--accent, #7c3aed), #ec4899)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 10px 30px rgba(124,58,237,0.12)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Updating...</span>
              </div>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />
    </ProtectedRoute>
  );
}
