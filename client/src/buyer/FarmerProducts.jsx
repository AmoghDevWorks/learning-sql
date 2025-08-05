import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Phone, Star, Filter, ShoppingCart, User, Leaf, TrendingUp, Calendar, Weight, Minus, Trash2 } from 'lucide-react';
import axios from 'axios'

const FarmMarketplace = () => {
  const [userType, setUserType] = useState('buyer'); // 'farmer' or 'buyer'
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Products', icon: '🌱' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
  ];

  const fetchProducts = () =>{
    setLoading(true)
    axios.get('http://localhost:8000/consumer/allProducts')
    .then(results => {
      setProducts(results.data)
    })
    .catch(err => {
      setError(err.message)
    })
    setLoading(false)
  }

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch('/consumer/allProducts');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      // Filter products with totalQuantity > 0
      const availableProducts = data.filter(product => product.totalQuantity > 0);
      setProducts(availableProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get emoji based on category
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'vegetables': '🥕',
      'fruits': '🍎',
      'grains': '🌾',
      'dairy': '🥛',
    };
    return emojiMap[category.toLowerCase()] || '🌱';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.farmName && product.farmName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.cartQuantity < product.totalQuantity) {
          return prev.map(item => 
            item.id === product.id 
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item
          );
        }
        return prev; // Don't add if already at max quantity
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const maxQuantity = item.totalQuantity;
        return { ...item, cartQuantity: Math.min(newQuantity, maxQuantity) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.pricePerKg * item.cartQuantity), 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-green-100">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl mb-2">{getCategoryEmoji(product.category)}</div>
          <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
            <span className="text-xs font-medium text-green-800 capitalize">{product.category}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        {product.description && product.description !== '-' && (
          <p className="text-gray-600 mb-3">{product.description}</p>
        )}
        
        <div className="space-y-2 mb-4">
          {product.farmName && product.farmName !== '-' && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2 text-green-600" />
              <span className="font-medium">{product.farmName}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>Harvested: {formatDate(product.harvestDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Weight className="w-4 h-4 mr-2 text-purple-500" />
            <span>{product.totalQuantity} kg available</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">₹{product.pricePerKg}</span>
            <span className="text-gray-500 ml-1">/kg</span>
          </div>
          {userType === 'buyer' && (
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              disabled={cart.find(item => item.id === product.id && item.cartQuantity >= product.totalQuantity)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const AddProductForm = () => {
    const [newProduct, setNewProduct] = useState({
      name: '',
      description: '',
      totalQuantity: '',
      pricePerKg: '',
      harvestDate: '',
      farmName: '',
      location: '',
      category: 'vegetables'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/farmer/addProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct)
        });
        
        if (response.ok) {
          alert('Product listed successfully!');
          setNewProduct({
            name: '',
            description: '',
            totalQuantity: '',
            pricePerKg: '',
            harvestDate: '',
            farmName: '',
            location: '',
            category: 'vegetables'
          });
          fetchProducts(); // Refresh products list
        } else {
          throw new Error('Failed to add product');
        }
      } catch (error) {
        alert('Error adding product: ' + error.message);
      }
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">List New Product</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional description of your product"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Kg (₹) *</label>
                <input
                  type="number"
                  value={newProduct.pricePerKg}
                  onChange={(e) => setNewProduct({...newProduct, pricePerKg: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Quantity (Kg) *</label>
                <input
                  type="number"
                  value={newProduct.totalQuantity}
                  onChange={(e) => setNewProduct({...newProduct, totalQuantity: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harvest Date *</label>
              <input
                type="date"
                value={newProduct.harvestDate}
                onChange={(e) => setNewProduct({...newProduct, harvestDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
              <input
                type="text"
                value={newProduct.farmName}
                onChange={(e) => setNewProduct({...newProduct, farmName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional farm name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                value={newProduct.location}
                onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="City, State"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
                <option value="pulses">Pulses</option>
                <option value="spices">Spices</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              List Product
            </button>
          </form>
        </div>
      </div>
    );
  };

  const CartView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart ({getTotalItems()} items)</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center flex-1">
                    <span className="text-2xl mr-4">{getCategoryEmoji(item.category)}</span>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.farmName && item.farmName !== '-' ? item.farmName : 'Local Farm'}
                      </p>
                      <p className="text-sm text-gray-500">{item.location}</p>
                      <p className="text-sm text-green-600 font-medium">₹{item.pricePerKg}/kg</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-12 text-center font-medium">{item.cartQuantity} kg</span>
                      
                      <button
                        onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                        disabled={item.cartQuantity >= item.totalQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Price */}
                    <div className="text-center min-w-[80px]">
                      <span className="font-medium">₹{item.pricePerKg * item.cartQuantity}</span>
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-600">Total Items: {getTotalItems()} kg</p>
                  <span className="text-2xl font-bold">Total: ₹{getTotalPrice()}</span>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'browse'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {userType === 'buyer' ? 'Browse Products' : 'View All Products'}
              </button>
              
              {userType === 'farmer' && (
                <button
                  onClick={() => setActiveTab('add')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'add'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  List Product
                </button>
              )}
              
              {userType === 'buyer' && (
                <button
                  onClick={() => setActiveTab('cart')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'cart'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Cart ({getTotalItems()})
                </button>
              )}
            </div>
            
            {/* User Type Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Switch to:</span>
              <button
                onClick={() => setUserType(userType === 'buyer' ? 'farmer' : 'buyer')}
                className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
              >
                {userType === 'buyer' ? 'Farmer' : 'Buyer'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <>
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products, farms, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'add' && userType === 'farmer' && <AddProductForm />}
        {activeTab === 'cart' && userType === 'buyer' && <CartView />}
      </main>
    </div>
  );
};

export default FarmMarketplace;