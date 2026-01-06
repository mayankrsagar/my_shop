"use client";
import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  FaCamera,
  FaTrash,
} from 'react-icons/fa';

import Modal from '../../components/Modal';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
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
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/update`,
        {
          name,
          email,
        },
        {
          withCredentials: true,
        }
      );
      await checkAuth(); // Refresh user data
      setModal({
        isOpen: true,
        type: "success",
        title: "Success!",
        message: "Profile updated successfully!",
      });
    } catch (err) {
      if (err.response?.data?.details) {
        const validationErrors = {};
        err.response.data.details.forEach((detail) => {
          validationErrors[detail.path] = detail.msg;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: err.response?.data?.error || "Update failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      await checkAuth(); // Refresh user data
    } catch (err) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Upload Failed",
        message: err.response?.data?.error || "Error uploading avatar",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
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
          await checkAuth(); // Refresh user data
        } catch (err) {
          setModal({
            isOpen: true,
            type: "error",
            title: "Delete Failed",
            message: err.response?.data?.error || "Error deleting avatar",
          });
        }
      },
    });
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Profile Settings
        </h1>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-400">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
              <FaCamera />
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
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          )}
          {avatar && (
            <button
              onClick={handleDeleteAvatar}
              className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
            >
              <FaTrash /> Remove Avatar
            </button>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              minLength="2"
              maxLength="50"
              pattern="[a-zA-Z\s]+"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={name}
              onChange={(e) =>
                setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))
              }
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              maxLength="100"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              value={user?.role || ""}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
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
