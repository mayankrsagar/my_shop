"use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";

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

const FilterControls = memo(({ onSearchChange, onFilterChange, onSortChange }) => (
  <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
    <input
      type="text"
      placeholder="Search products..."
      className="border p-2 rounded flex-grow"
      onChange={onSearchChange}
    />
    <select className="border p-2 rounded" onChange={onFilterChange}>
      <option value="">All Categories</option>
      <option value="Innerwear">Innerwear</option>
      <option value="Clothing">Clothing</option>
    </select>
    <select className="border p-2 rounded" onChange={onSortChange}>
      <option value="">Sort By</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  </div>
));

FilterControls.displayName = 'FilterControls';

const ProductGrid = memo(({ products }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {products.map((prod) => (
      <ProductCard key={prod._id} product={prod} />
    ))}
  </div>
));

ProductGrid.displayName = 'ProductGrid';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSort(e.target.value);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};
        if (filter) params.category = filter;
        if (sort) params.sort = sort;
        if (debouncedSearch) params.search = debouncedSearch;

        const res = await axios.get("http://localhost:5000/api/products", {
          params,
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [filter, sort, debouncedSearch]);

  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="space-y-6">
      <FilterControls
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <ProductGrid products={memoizedProducts} />
      {products.length === 0 && (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
}
