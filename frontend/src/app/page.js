"use client";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';
import {
  FaFilter,
  FaMagic,
  FaSearch,
  FaSort,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

import ProductCard from '@/components/ProductCard';

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const FilterControls = memo(
  ({ onSearchChange, onFilterChange, onSortChange, categories }) => (
    <div className="glass rounded-2xl p-6 space-y-4 border border-purple-200/30 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <FaMagic className="text-purple-400" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Find Your Perfect Product
        </h2>
        <HiSparkles className="text-yellow-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text"
            placeholder="Search magical products..."
            className="w-full pl-12 pr-4 py-3 bg-white/90 dark:bg-gray-700/50 backdrop-blur-sm border border-purple-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 shadow-sm"
            onChange={onSearchChange}
          />
        </div>

        {/* Category Filter */}
        <div className="relative group">
          <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
          <select
            className="w-full pl-12 pr-4 py-3 bg-white/90 dark:bg-gray-700/50 backdrop-blur-sm border border-purple-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 appearance-none cursor-pointer shadow-sm"
            onChange={onFilterChange}
          >
            <option
              value=""
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            >
              All Categories
            </option>
            {categories.map((category) => (
              <option
                key={category}
                value={category}
                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              >
                {category}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Sort */}
        <div className="relative group">
          <FaSort className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
          <select
            className="w-full pl-12 pr-4 py-3 bg-white/90 dark:bg-gray-700/50 backdrop-blur-sm border border-purple-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 appearance-none cursor-pointer shadow-sm"
            onChange={onSortChange}
          >
            <option
              value=""
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            >
              Sort By
            </option>
            <option
              value="price_asc"
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            >
              Price: Low to High
            </option>
            <option
              value="price_desc"
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            >
              Price: High to Low
            </option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
);

FilterControls.displayName = "FilterControls";

const ProductGrid = memo(({ products }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
    {products.map((prod) => (
      <ProductCard key={prod._id} product={prod} />
    ))}
  </div>
));

ProductGrid.displayName = "ProductGrid";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16 space-y-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-600 rounded-full animate-spin animation-delay-150"></div>
    </div>
    <p className="text-white/80 font-medium">Loading magical products...</p>
  </div>
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [donationStats, setDonationStats] = useState({
    totalAmount: 0,
    totalCount: 0,
    recentDonations: [],
  });

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchDonationStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payment/donation-stats`
        );
        setDonationStats(res.data);
      } catch (err) {
        console.error("Error fetching donation stats:", err);
      }
    };

    fetchCategories();
    fetchDonationStats();
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSortChange = useCallback((e) => {
    setSort(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page: pagination.page };
        if (filter) params.category = filter;
        if (sort) params.sort = sort;
        if (debouncedSearch) params.search = debouncedSearch;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
          { params }
        );
        setProducts(res.data.products);
        setPagination(res.data.pagination);
        // Refresh categories when products change
        const categoriesRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filter, sort, debouncedSearch, pagination.page]);

  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="min-h-screen space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8 sm:py-12 space-y-4 sm:space-y-6 px-4">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <HiSparkles className="text-3xl sm:text-4xl text-yellow-400 float" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent drop-shadow-lg">
            🌸 Welcome to BuyBloom 🌸
          </h1>
          <HiSparkles
            className="text-3xl sm:text-4xl text-yellow-400 float"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed px-4 font-medium">
          Join our incredible community where shopping blooms into something
          beautiful! 🌱
        </p>

        {/* Community Impact Section */}
        <div className="glass rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto mt-8 sm:mt-12 border border-slate-200/40 dark:border-slate-700/50 mx-4 bg-gradient-to-br from-slate-50/90 via-cyan-50/70 to-violet-50/70 dark:bg-slate-800/50 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">🌟</span>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:text-slate-50">
              Community Impact
            </h2>
            <span className="text-xl sm:text-2xl">🌟</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 drop-shadow-md">
                ₹{donationStats.totalAmount.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-200/80 text-sm sm:text-base">
                💰 Total Raised
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 drop-shadow-md">
                {donationStats.totalCount}
              </div>
              <div className="text-gray-600 dark:text-gray-200/80 text-sm sm:text-base">
                🦸 Amazing Heroes
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 drop-shadow-md">
                {donationStats.recentDonations.length > 0
                  ? donationStats.recentDonations[0].donorName
                  : "None yet"}
              </div>
              <div className="text-gray-600 dark:text-gray-200/80 text-sm sm:text-base">
                ❤️ Recent Hero
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-purple-50/80 dark:bg-gray-700/30 rounded-xl border border-purple-200/50 dark:border-gray-600/30 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-base sm:text-lg">🎯</span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base">
                {donationStats.recentDonations.length > 0
                  ? `${donationStats.recentDonations[0].donorName} donated ₹${donationStats.recentDonations[0].amount}`
                  : "Be the first to donate!"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300/70">
              <span>🎯 Goal: ₹50,000</span>
              <span>•</span>
              <span>
                {((donationStats.totalAmount / 50000) * 100).toFixed(1)}%
                Complete!
              </span>
              <span className="text-orange-400">🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="px-4">
        <FilterControls
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          categories={categories}
        />
      </div>

      {/* Products Section */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ProductGrid products={memoizedProducts} />
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-slate-700 dark:text-slate-200">
            No magical products found.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search or filters!
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4 py-8">
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
            className="px-6 py-3 bg-white/10 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl text-white dark:text-gray-200 font-medium hover:bg-white/20 dark:hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Previous
          </button>
          <div className="flex items-center space-x-2">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold">
              {pagination.page}
            </span>
            <span className="text-slate-500 dark:text-slate-400">of</span>
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              {pagination.pages}
            </span>
          </div>
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.pages}
            className="px-6 py-3 bg-white/10 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl text-white dark:text-gray-200 font-medium hover:bg-white/20 dark:hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
