const FilterControls = memo(
  ({ onSearchChange, onFilterChange, onSortChange, categories }) => (
    <div className="glass rounded-2xl p-6 space-y-4 border border-white/20 dark:border-gray-700/50 bg-white/10 dark:bg-gray-800/50">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <FaMagic className="text-purple-400" />
        <h2 className="text-lg font-semibold text-white dark:text-gray-200">
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
            className="w-full pl-12 pr-4 py-3 bg-white/10 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl text-white dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
            onChange={onSearchChange}
          />
        </div>

        {/* Category Filter */}
        <div className="relative group">
          <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
          <select
            className="w-full pl-12 pr-4 py-3 bg-white/10 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl text-white dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 appearance-none cursor-pointer"
            onChange={onFilterChange}
          >
            <option value="" className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200">
              All Categories
            </option>
            {categories.map((category) => (
              <option
                key={category}
                value={category}
                className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200"
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
            className="w-full pl-12 pr-4 py-3 bg-white/10 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl text-white dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 appearance-none cursor-pointer"
            onChange={onSortChange}
          >
            <option value="" className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200">
              Sort By
            </option>
            <option value="price_asc" className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200">
              Price: Low to High
            </option>
            <option value="price_desc" className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200">
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