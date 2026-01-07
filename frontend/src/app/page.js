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
        <div className="glass rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto mt-8 sm:mt-12 border border-purple-200/50 dark:border-white/10 mx-4 bg-white/70 dark:bg-zinc-900/80 shadow-2xl backdrop-blur-xl transition-all hover:shadow-purple-500/10">
          {/* Header with improved contrast */}
          <div className="flex items-center justify-center space-x-3 mb-8 sm:mb-10">
            <span className="text-2xl animate-bounce">🌟</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Community Impact
            </h2>
            <span
              className="text-2xl animate-bounce"
              style={{ animationDelay: "0.2s" }}
            >
              🌟
            </span>
          </div>

          {/* Stats Grid - Fixed Visibility & Mobile Layout */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
            <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-2xl bg-violet-50/50 dark:bg-white/5">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                ₹{donationStats.totalAmount.toLocaleString()}
              </div>
              <div className="text-violet-600 dark:text-violet-400 text-sm sm:text-base font-bold uppercase tracking-wider">
                💰 Total Raised
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-2xl bg-cyan-50/50 dark:bg-white/5">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {donationStats.totalCount}
              </div>
              <div className="text-cyan-600 dark:text-cyan-400 text-sm sm:text-base font-bold uppercase tracking-wider">
                🦸 Amazing Heroes
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-2xl bg-fuchsia-50/50 dark:bg-white/5">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white truncate max-w-full px-2">
                {donationStats.recentDonations.length > 0
                  ? donationStats.recentDonations[0].donorName
                  : "---"}
              </div>
              <div className="text-fuchsia-600 dark:text-fuchsia-400 text-sm sm:text-base font-bold uppercase tracking-wider">
                ❤️ Recent Hero
              </div>
            </div>
          </div>

          {/* Goal & Progress Bar Section */}
          <div className="mt-10 p-5 sm:p-8 bg-white/50 dark:bg-zinc-800/50 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 dark:bg-orange-500/20 p-2 rounded-lg">
                  <span className="text-xl">🎯</span>
                </div>
                <span className="text-slate-800 dark:text-zinc-100 font-bold text-base sm:text-lg">
                  {donationStats.recentDonations.length > 0
                    ? `${donationStats.recentDonations[0].donorName} just gave ₹${donationStats.recentDonations[0].amount}!`
                    : "Waiting for our first hero..."}
                </span>
              </div>
              <div className="text-sm font-black text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                GOAL: ₹50,000
              </div>
            </div>

            {/* Modern Progress Bar */}
            <div className="relative w-full h-4 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{
                  width: `${Math.min(
                    (donationStats.totalAmount / 50000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between items-center text-xs sm:text-sm font-bold">
              <span className="text-violet-600 dark:text-violet-400">
                {((donationStats.totalAmount / 50000) * 100).toFixed(1)}%
                Completed
              </span>
              <span className="flex items-center text-orange-500 animate-pulse">
                KEEP BLOOMING <span className="ml-1">🔥</span>
              </span>
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
