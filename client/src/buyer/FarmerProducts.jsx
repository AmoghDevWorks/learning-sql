import React, { useState, useEffect, useContext } from 'react';
import { Search, MapPin, User, Calendar, Weight, Minus, Trash2, Plus, ShoppingCart } from 'lucide-react';
import axios from 'axios'
import userContext from '../utils/UserContext'
import { useNavigate } from 'react-router-dom'

const ConsumerMarketplace = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user,setUser } = useContext(userContext)
  const navigate = useNavigate()

  const categories = [
    { id: 'all', name: 'All Products', icon: '🌱' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
  ];

  const fetchProducts = () =>{
    setLoading(true)

    if(!user){
      alert('Please login first')
      navigate('/consumerSignIn')
    }

    axios.get(`http://localhost:8000/consumer/allProducts?id=${user}`)
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

  const handleOrder = () =>{
    if(cart.length === 0) return;

    axios.post(`http://localhost:8000/consumer/orderProduct?consumerId=${user}`,cart)
    .then(results => {
      alert('Ordered Successfully')
      navigate('/')
    })
    .catch(err => {
      console.log(err)
      setError('unable to order')
    })
  }

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
          <button
            onClick={() => addToCart(product)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={cart.find(item => item.id === product.id && item.cartQuantity >= product.totalQuantity)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const CartView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart ({getTotalItems()} items)</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <button
              onClick={() => setActiveTab('browse')}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
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
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  onClick={handleOrder}
                >
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
                Browse Products
              </button>
              
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
            </div>
            
            {/* Brand/Title */}
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-800">Farm Marketplace</h1>
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

        {activeTab === 'cart' && <CartView />}
      </main>
    </div>
  );
};

export default ConsumerMarketplace;