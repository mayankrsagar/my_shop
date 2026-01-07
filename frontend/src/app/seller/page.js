"use client";
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaChartLine, FaBox, FaStar, FaRocket } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

import ProtectedRoute from '../../components/ProtectedRoute';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [lastSync, setLastSync] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    discount: "",
    description: "",
    image: "",
    imageFile: null,
    brand: "",
    tags: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (formData.category === "custom") {
      if (!customCategory.trim()) {
        newErrors.category = "Custom category cannot be empty";
      }
    } else if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.price || formData.price < 1) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.imageFile && !formData.image) {
      newErrors.image = "Product image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchSalesData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/seller/sales`
      );
      setSalesData(res.data);
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/seller/products`
      );
      setProducts(res.data);
      setLastSync(Date.now());
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error('Failed to load products');
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  }, [fetchProducts]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSalesData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      if (Date.now() - lastSync > 60000) {
        refreshProducts();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchProducts, fetchCategories, fetchSalesData, lastSync, refreshProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !validateForm()) return;

    // Store original state for rollback
    const originalProducts = [...products];
    const transactionId = Date.now().toString();
    
    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append("name", formData.name.trim());
    submitData.append(
      "category",
      formData.category === "custom" ? customCategory.trim() : formData.category
    );
    submitData.append("price", formData.price);
    if (formData.originalPrice) submitData.append("originalPrice", formData.originalPrice);
    if (formData.discount) submitData.append("discount", formData.discount);
    submitData.append("description", formData.description.trim());
    submitData.append("transactionId", transactionId);

    if (formData.imageFile) {
      submitData.append("productImage", formData.imageFile);
    } else {
      submitData.append("image", formData.image);
    }

    if (formData.brand) submitData.append("brand", formData.brand.trim());
    if (formData.tags) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      submitData.append("tags", JSON.stringify(tagsArray));
    }

    // Optimistic update for editing
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p._id === editingProduct._id 
          ? { ...p, ...Object.fromEntries(submitData), _transactionId: transactionId }
          : p
      ));
    }

    try {
      let response;
      if (editingProduct) {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/seller/products/${editingProduct._id}`,
          Object.fromEntries(submitData)
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/seller/products`,
          submitData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      
      // Atomic state reset
      setFormData({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        discount: "",
        description: "",
        image: "",
        imageFile: null,
        brand: "",
        tags: "",
      });
      setCustomCategory("");
      setImagePreview("");
      setErrors({});
      setShowForm(false);
      setEditingProduct(null);
      
      // Refresh data to ensure consistency
      await Promise.all([fetchProducts(), fetchCategories()]);
      toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
    } catch (err) {
      // Rollback optimistic updates
      if (editingProduct) {
        setProducts(originalProducts);
      }
      
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Transaction failed";
      toast.error(`${errorMessage} - Changes rolled back`);
      setErrors({
        general: errorMessage,
      });
      console.error('Product transaction failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure?")) return;
    
    // Store original state for rollback
    const originalProducts = [...products];
    const transactionId = Date.now().toString();
    
    // Optimistic update with transaction tracking
    setProducts(prev => prev.filter(p => p._id !== productId));
    setDeletingId(productId);
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/seller/products/${productId}`,
        { data: { transactionId } }
      );
      
      toast.success('Product deleted successfully!');
      // Refresh to ensure consistency after successful transaction
      await refreshProducts();
    } catch (err) {
      // Rollback transaction - restore original state
      setProducts(originalProducts);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Delete transaction failed';
      toast.error(`${errorMessage} - Changes rolled back`);
      console.error('Product delete transaction failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.originalPrice || product.price,
      originalPrice: product.originalPrice || "",
      discount: product.discount || "",
      description: product.description,
      image: product.image,
      imageFile: null,
      brand: product.brand || "",
      tags: product.tags ? product.tags.join(', ') : "",
    });
    setImagePreview(product.image);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      discount: "",
      description: "",
      image: "",
      imageFile: null,
      brand: "",
      tags: "",
    });
    setImagePreview("");
    setShowForm(false);
  };

  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <div className="min-h-screen space-y-8">
        {/* Header */}
        <div className="glass rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <FaRocket className="text-3xl text-yellow-400 float" />
              <div>
                <h1 className="text-4xl font-bold gradient-text">🏪 Seller Dashboard</h1>
                <p className="text-gray-600 dark:text-white/70 mt-1">Manage your magical products and sales</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "products"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-white/20 dark:hover:bg-white/20"
                }`}
              >
                <FaBox />
                <span>Products</span>
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "sales"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-white/20 dark:hover:bg-white/20"
                }`}
              >
                <FaChartLine />
                <span>Sales</span>
              </button>
              {activeTab === "products" && (
                <>
                  <button
                    onClick={refreshProducts}
                    disabled={isRefreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500/80 dark:bg-blue-600/80 text-white rounded-xl font-medium hover:bg-blue-600/80 dark:hover:bg-blue-700/80 transition-all duration-300 disabled:opacity-50"
                  >
                    <div className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}>
                      🔄
                    </div>
                    <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (showForm && editingProduct) {
                        handleCancelEdit();
                      } else {
                        setShowForm(!showForm);
                      }
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <FaPlus />
                    <span>{showForm ? (editingProduct ? "Cancel Edit" : "Cancel") : "Add Product"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sales Tab */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            {salesData ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                        <span className="text-2xl text-white">💰</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-white/80">Total Sales</h3>
                        <p className="text-3xl font-bold gradient-text">₹{salesData.totalSales}</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                        <span className="text-2xl text-white">📦</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-white/80">Total Orders</h3>
                        <p className="text-3xl font-bold gradient-text">{salesData.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
                      <span>📈</span>
                      <span>Monthly Sales</span>
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(salesData.monthlyData).map(([month, amount]) => (
                        <div key={month} className="flex justify-between items-center p-3 bg-gray-100/50 dark:bg-white/5 rounded-lg">
                          <span className="text-gray-700 dark:text-white/80">{month}</span>
                          <span className="font-semibold gradient-text">₹{amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
                      <span>📅</span>
                      <span>Daily Sales (Last 30 Days)</span>
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {Object.entries(salesData.dailyData).map(([day, amount]) => (
                        <div key={day} className="flex justify-between items-center p-2 bg-gray-100/50 dark:bg-white/5 rounded-lg">
                          <span className="text-gray-700 dark:text-white/80 text-sm">{day}</span>
                          <span className="font-semibold gradient-text text-sm">₹{amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass rounded-2xl p-12 text-center border border-white/20">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-xl text-gray-700 dark:text-white/80">No sales data available yet</p>
                <p className="text-gray-600 dark:text-white/60 mt-2">Start selling to see your analytics!</p>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Add Product Form */}
            {showForm && (
              <div className="glass rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
                  <HiSparkles className="text-yellow-400" />
                  <span>{editingProduct ? "Edit Product" : "Add New Magical Product"}</span>
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="w-full p-4 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  
                  <select
                    className="w-full p-4 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 appearance-none cursor-pointer"
                    value={formData.category === "custom" ? "custom" : formData.category}
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setFormData({ ...formData, category: "custom" });
                      } else {
                        setFormData({ ...formData, category: e.target.value });
                        setCustomCategory("");
                      }
                    }}
                    required
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                        {category}
                      </option>
                    ))}
                    <option value="custom" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white">Add New Category</option>
                  </select>
                  
                  {formData.category === "custom" && (
                    <input
                      type="text"
                      placeholder="Enter new category"
                      className="w-full p-4 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  )}
                  
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    className="w-full p-4 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                  
                  <input
                    type="text"
                    placeholder="Brand Name (Optional)"
                    className="w-full p-4 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                  
                  <input
                    type="text"
                    placeholder="Tags (comma separated, e.g: wireless, bluetooth, gaming)"
                    className="w-full p-4 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                  
                  <input
                    type="number"
                    placeholder="Discount (%) - Optional"
                    className="w-full p-4 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    min="0"
                    max="100"
                  />
                  
                  <textarea
                    placeholder="Product Description"
                    className="md:col-span-2 w-full p-4 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 h-32 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                  
                  {!editingProduct && (
                    <input
                      type="file"
                      accept="image/*"
                      className="md:col-span-2 w-full p-4 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:cursor-pointer hover:file:from-purple-700 hover:file:to-pink-700 transition-all duration-300"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({ ...formData, imageFile: file, image: "" });
                          const reader = new FileReader();
                          reader.onloadend = () => setImagePreview(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  )}
                  
                  {imagePreview && (
                    <div className="md:col-span-2">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="rounded-xl object-cover"
                      />
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="md:col-span-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FaPlus />
                    <span>{isSubmitting ? (editingProduct ? "Updating..." : "Creating...") : (editingProduct ? "Update Product" : "Create Product")}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Products Grid */}
            <div className="glass rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
                  <FaBox className="text-purple-400" />
                  <span>My Products ({products.length})</span>
                </h2>
              </div>
              
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white/5 rounded-xl p-4 card-hover border border-white/10">
                      <div className="relative mb-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 backdrop-blur-sm rounded-lg text-white hover:bg-red-600/80 transition-all duration-300 disabled:opacity-50"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="absolute top-2 right-12 p-2 bg-blue-500/80 backdrop-blur-sm rounded-lg text-white hover:bg-blue-600/80 transition-all duration-300"
                        >
                          <span className="text-sm">✏️</span>
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{product.name}</h3>
                        <p className="text-purple-600 dark:text-purple-300 text-sm">{product.category}</p>
                        <p className="text-gray-600 dark:text-white/70 text-sm line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex flex-col">
                            <span className="text-xl font-bold gradient-text">₹{product.price}</span>
                            {product.discount > 0 && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                                <span className="text-xs text-green-400 font-semibold">{product.discount}% OFF</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 text-sm" />
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 px-3 py-2 bg-blue-500/80 backdrop-blur-sm rounded-lg text-white text-sm hover:bg-blue-600/80 transition-all duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                            className="flex-1 px-3 py-2 bg-red-500/80 backdrop-blur-sm rounded-lg text-white text-sm hover:bg-red-600/80 transition-all duration-300 disabled:opacity-50"
                          >
                            {deletingId === product._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-xl text-gray-700 dark:text-white/80">No products yet</p>
                  <p className="text-gray-600 dark:text-white/60 mt-2">Add your first magical product!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
