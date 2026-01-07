"use client";
import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminDashboard (theme-aware)
 * - Uses CSS variables defined in your global stylesheet for light/dark parity:
 *   --card-bg, --glass-bg, --text-primary, --text-secondary, --border-color
 */

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userSearch, setUserSearch] = useState("");
  const [userRole, setUserRole] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  const usersPerPage = 10;
  const productsPerPage = 10;

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, productsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`),
      ]);
      setStats(statsRes.data || {});
      setUsers(usersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const q = userSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchesRole = !userRole || u.role === userRole;
    return matchesSearch && matchesRole;
  });

  const filteredProducts = products.filter((p) => {
    const q = productSearch.trim().toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q);
    const matchesCategory = !productCategory || p.category === productCategory;
    return matchesSearch && matchesCategory;
  });

  const userPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const productPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );

  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * usersPerPage,
    userPage * usersPerPage
  );
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productsPerPage,
    productPage * productsPerPage
  );

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`
      );
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(
        "Error deleting user: " + (err.response?.data?.error || err.message)
      );
    }
  };

  // role color map (keeps visibility in both themes)
  const ROLE_COLORS = {
    admin: "#ef4444", // red
    seller: "#10b981", // green
    user: "#3b82f6", // blue
  };

  // utility: hex -> rgba with alpha hex (very small helper for bg tint)
  const tintHex = (hex, alphaHex = "22") => {
    // ensure hex is like #rrggbb
    if (!hex || hex[0] !== "#" || hex.length !== 7) return "transparent";
    return `${hex}${alphaHex}`; // e.g. #3b82f622
  };

  if (loading)
    return (
      <div
        className="text-center py-12"
        style={{ color: "var(--text-primary)" }}
      >
        Loading...
      </div>
    );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div
        className="space-y-6 px-4 sm:px-6 lg:px-8 py-6"
        style={{ color: "var(--text-primary)" }}
      >
        <div className="flex items-center justify-between">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Admin Dashboard
          </h1>
          <div
            className="text-sm text-[0.9rem]"
            style={{ color: "var(--text-secondary)" }}
          >
            Signed in as{" "}
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              {user?.name || "—"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Total Users", value: stats.totalUsers ?? 0 },
            { title: "Total Sellers", value: stats.totalSellers ?? 0 },
            { title: "Total Products", value: stats.totalProducts ?? 0 },
            { title: "Active Carts", value: stats.totalCarts ?? 0 },
          ].map((s, idx) => (
            <div
              key={s.title}
              className="p-5 rounded-xl card-hover shadow"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              <div
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.title}
              </div>
              <div className="mt-2 text-2xl font-extrabold gradient-text">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* User Management */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderBottom: "1px solid var(--border-color)" }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                User Management
              </h2>

              <div className="flex items-center gap-3">
                <input
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUserPage(1);
                  }}
                  placeholder="Search users..."
                  className="px-3 py-2 rounded-md shadow-sm"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
                <select
                  value={userRole}
                  onChange={(e) => {
                    setUserRole(e.target.value);
                    setUserPage(1);
                  }}
                  className="px-3 py-2 rounded-md shadow-sm"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full"
              style={{ borderCollapse: "separate", borderSpacing: 0 }}
            >
              <thead style={{ background: "var(--glass-bg)" }}>
                <tr>
                  {["Name", "Email", "Role", "Created", "Actions"].map((t) => (
                    <th
                      key={t}
                      className="px-6 py-3 text-left text-xs font-medium uppercase"
                      style={{
                        color: "var(--text-secondary)",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map((u) => (
                  <tr
                    key={u._id}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {u.name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs rounded-full font-medium"
                        style={{
                          color: ROLE_COLORS[u.role] || ROLE_COLORS.user,
                          background: tintHex(
                            ROLE_COLORS[u.role] || ROLE_COLORS.user,
                            "22"
                          ),
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="px-3 py-1 rounded-md text-sm"
                        style={{
                          color: "var(--text-primary)",
                          border: "1px solid var(--border-color)",
                          background: "transparent",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {userPages > 1 && (
            <div
              className="px-6 py-3 flex items-center justify-center gap-3"
              style={{
                borderTop: "1px solid var(--border-color)",
                background: "var(--card-bg)",
              }}
            >
              <button
                onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                disabled={userPage === 1}
                className="px-3 py-1 rounded-md"
                style={{
                  border: "1px solid var(--border-color)",
                  background: "var(--glass-bg)",
                  color: "var(--text-primary)",
                  opacity: userPage === 1 ? 0.5 : 1,
                }}
              >
                Previous
              </button>
              <div style={{ color: "var(--text-secondary)" }}>
                Page {userPage} of {userPages}
              </div>
              <button
                onClick={() => setUserPage((p) => Math.min(p + 1, userPages))}
                disabled={userPage === userPages}
                className="px-3 py-1 rounded-md"
                style={{
                  border: "1px solid var(--border-color)",
                  background: "var(--glass-bg)",
                  color: "var(--text-primary)",
                  opacity: userPage === userPages ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderBottom: "1px solid var(--border-color)" }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                All Products ({filteredProducts.length})
              </h2>

              <div className="flex items-center gap-3">
                <input
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setProductPage(1);
                  }}
                  placeholder="Search products..."
                  className="px-3 py-2 rounded-md shadow-sm"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
                <select
                  value={productCategory}
                  onChange={(e) => {
                    setProductCategory(e.target.value);
                    setProductPage(1);
                  }}
                  className="px-3 py-2 rounded-md shadow-sm"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="Innerwear">Innerwear</option>
                  <option value="Clothing">Clothing</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: "var(--glass-bg)" }}>
                <tr>
                  {["Product", "Seller", "Category", "Price", "Created"].map(
                    (t) => (
                      <th
                        key={t}
                        className="px-6 py-3 text-left text-xs font-medium uppercase"
                        style={{
                          color: "var(--text-secondary)",
                          borderBottom: "1px solid var(--border-color)",
                        }}
                      >
                        {t}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.map((p) => (
                  <tr
                    key={p._id}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div
                            style={{
                              color: "var(--text-primary)",
                              fontWeight: 600,
                            }}
                          >
                            {p.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {p.sellerId?.name || "System"}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {p.category}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: "var(--text-primary)" }}
                    >
                      ₹{p.price}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* product pagination */}
          {productPages > 1 && (
            <div
              className="px-6 py-3 flex items-center justify-center gap-3"
              style={{
                borderTop: "1px solid var(--border-color)",
                background: "var(--card-bg)",
              }}
            >
              <button
                onClick={() => setProductPage((p) => Math.max(p - 1, 1))}
                disabled={productPage === 1}
                className="px-3 py-1 rounded-md"
                style={{
                  border: "1px solid var(--border-color)",
                  background: "var(--glass-bg)",
                  color: "var(--text-primary)",
                  opacity: productPage === 1 ? 0.5 : 1,
                }}
              >
                Previous
              </button>
              <div style={{ color: "var(--text-secondary)" }}>
                Page {productPage} of {productPages}
              </div>
              <button
                onClick={() =>
                  setProductPage((p) => Math.min(p + 1, productPages))
                }
                disabled={productPage === productPages}
                className="px-3 py-1 rounded-md"
                style={{
                  border: "1px solid var(--border-color)",
                  background: "var(--glass-bg)",
                  color: "var(--text-primary)",
                  opacity: productPage === productPages ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
