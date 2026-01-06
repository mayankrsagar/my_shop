"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = "Product name must be between 2 and 100 characters";
    } else if (!/^[a-zA-Z0-9\s\-&().,]+$/.test(formData.name)) {
      newErrors.name = "Product name contains invalid characters";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || formData.price < 1 || formData.price > 999999) {
      newErrors.price = "Price must be between 1 and 999999";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10 || formData.description.length > 500) {
      newErrors.description = "Description must be between 10 and 500 characters";
    } else if (!/^[a-zA-Z0-9\s\-&().,!?]+$/.test(formData.description)) {
      newErrors.description = "Description contains invalid characters";
    }
    
    if (!formData.imageFile && !formData.image) {
      newErrors.image = "Product image is required";
    } else if (formData.image && !/^https?:\/\/.+/.test(formData.image)) {
      newErrors.image = "Please provide a valid image URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setErrors({...errors, image: 'Please select a valid image file'});
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({...errors, image: 'Image size must be less than 5MB'});
        return;
      }
      
      setFormData({...formData, imageFile: file, image: ""});
      setErrors({...errors, image: ""});
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({...formData, image: url, imageFile: null});
    setImagePreview(url);
    if (url && !/^https?:\/\/.+/.test(url)) {
      setErrors({...errors, image: 'Please provide a valid image URL'});
    } else {
      setErrors({...errors, image: ""});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('category', formData.category);
    submitData.append('price', formData.price);
    submitData.append('description', formData.description.trim());
    
    if (formData.imageFile) {
      submitData.append('productImage', formData.imageFile);
    } else if (formData.image) {
      submitData.append('image', formData.image);
    }
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/products`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ name: "", category: "", price: "", description: "", image: "", imageFile: null });
      setImagePreview("");
      setErrors({});
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      if (err.response?.data?.details) {
        const validationErrors = {};
        err.response.data.details.forEach(detail => {
          validationErrors[detail.path] = detail.msg;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: err.response?.data?.error || "Error creating product" });
      }
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/products/${productId}`);
      fetchProducts();
    } catch (err) {
      alert("Error deleting product: " + err.response?.data?.error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}
              <div>
                <input
                  type="text"
                  placeholder="Product Name"
                  className={`w-full p-2 border rounded ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <select
                  className={`w-full p-2 border rounded ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Innerwear">Innerwear</option>
                  <option value="Clothing">Clothing</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Price"
                  className={`w-full p-2 border rounded ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  min="1"
                  max="999999"
                  required
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
              <div>
                <textarea
                  placeholder="Description (10-500 characters)"
                  className={`w-full p-2 border rounded ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  minLength="10"
                  maxLength="500"
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className={`w-full p-2 border rounded ${
                    errors.image ? "border-red-500" : "border-gray-300"
                  }`}
                  onChange={handleFileChange}
                />
                <div className="text-center text-gray-500">OR</div>
                <input
                  type="url"
                  placeholder="Image URL (https://...)"
                  className={`w-full p-2 border rounded ${
                    errors.image ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.image}
                  onChange={handleUrlChange}
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border"
                      onError={() => setErrors({...errors, image: 'Invalid image URL'})}
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Product
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">My Products ({products.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded object-cover" src={product.image} alt={product.name} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}