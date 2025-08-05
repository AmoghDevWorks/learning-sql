import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import userContext from '../utils/UserContext';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const { user,setUser } = useContext(userContext)

  // Categories for filtering
  const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy'];

const fetchProducts = () => {
    setLoading(true)
    axios.get(`http://localhost:8000/farmer/getAllProducts?farmerId=${user}`)
    .then(response => {
        if(!response.ok) setError('Failed to fetch products')
        return response.data
    })
    .then(data => {
        setError(null)
        setProducts(data.results)
    })
    .catch(err => {
        setError(err.message)
    })
    setLoading(false)
}

  useEffect(() => {
    
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.pricePerKg - b.pricePerKg;
        case 'quantity':
          return b.totalQuantity - a.totalQuantity;
        case 'harvest':
          return new Date(b.harvestDate) - new Date(a.harvestDate);
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Fresh produce directly from farmers</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search products, farms, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
                <option value="quantity">Quantity (High to Low)</option>
                <option value="harvest">Harvest Date (Recent First)</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Product Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg flex items-center justify-center">
                  <div className="text-4xl">
                    {product.category.toLowerCase() === 'fruits' ? '🍎' :
                     product.category.toLowerCase() === 'vegetables' ? '🥕' :
                     product.category.toLowerCase() === 'grains' ? '🌾' :
                     product.category.toLowerCase() === 'pulses' ? '🫘' :
                     product.category.toLowerCase() === 'spices' ? '🌶️' : '🌱'}
                  </div>
                </div>

                <div className="p-4">
                  {/* Product Name and Category */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Description */}
                  {product.description && product.description !== '-' && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}

                  {/* Price and Quantity */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-xl font-bold text-green-600">₹{product.pricePerKg}</span>
                      <span className="text-sm text-gray-500">/kg</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{product.totalQuantity} kg</p>
                      <p className="text-xs text-gray-500">available</p>
                    </div>
                  </div>

                  {/* Farm Details */}
                  <div className="border-t pt-3">
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-600">🏮 </span>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {product.farmName && product.farmName !== '-' ? product.farmName : 'Farm'}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-600">📍 </span>
                      <span className="text-sm text-gray-600 truncate">{product.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">📅 </span>
                      <span className="text-sm text-gray-600">Harvested: {formatDate(product.harvestDate)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;