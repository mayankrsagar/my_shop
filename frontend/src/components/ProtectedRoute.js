"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [], requireAuth = true }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      router.push("/login");
      return;
    }

    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.push("/");
      return;
    }
  }, [user, loading, router, allowedRoles, requireAuth]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (requireAuth && !user) {
    return <div className="text-center py-10">Redirecting to login...</div>;
  }

  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <div className="text-center py-10">Access denied. Redirecting...</div>;
  }

  return children;
}