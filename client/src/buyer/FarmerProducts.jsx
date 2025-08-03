import React, { useState } from 'react';
import { Search, Plus, MapPin, Phone, Star, Filter, ShoppingCart, User, Leaf, TrendingUp, Calendar, Weight } from 'lucide-react';

const FarmMarketplace = () => {
  const [userType, setUserType] = useState('buyer'); // 'farmer' or 'buyer'
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  // Sample data
  const products = [
    {
      id: 1,
      name: 'Organic Tomatoes',
      farmer: 'Green Valley Farm',
      location: 'Karnataka, India',
      price: 45,
      unit: 'kg',
      quantity: 500,
      category: 'vegetables',
      image: '🍅',
      rating: 4.8,
      phone: '+91 9876543210',
      description: 'Fresh organic tomatoes, pesticide-free',
      harvestDate: '2025-08-01'
    },
    {
      id: 2,
      name: 'Basmati Rice',
      farmer: 'Sunrise Agriculture',
      location: 'Punjab, India',
      price: 80,
      unit: 'kg',
      quantity: 2000,
      category: 'grains',
      image: '🌾',
      rating: 4.9,
      phone: '+91 9876543211',
      description: 'Premium quality basmati rice',
      harvestDate: '2025-07-15'
    },
    {
      id: 3,
      name: 'Fresh Milk',
      farmer: 'Dairy Dreams',
      location: 'Tamil Nadu, India',
      price: 55,
      unit: 'liter',
      quantity: 200,
      category: 'dairy',
      image: '🥛',
      rating: 4.7,
      phone: '+91 9876543212',
      description: 'Pure cow milk, daily fresh',
      harvestDate: '2025-08-03'
    },
    {
      id: 4,
      name: 'Alphonso Mangoes',
      farmer: 'Tropical Orchards',
      location: 'Maharashtra, India',
      price: 120,
      unit: 'kg',
      quantity: 300,
      category: 'fruits',
      image: '🥭',
      rating: 4.9,
      phone: '+91 9876543213',
      description: 'Premium Alphonso mangoes, export quality',
      harvestDate: '2025-07-20'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: '🌱' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-green-100">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl mb-2">{product.image}</div>
          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-3">{product.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-green-600" />
            <span className="font-medium">{product.farmer}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>Harvested: {product.harvestDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Weight className="w-4 h-4 mr-2 text-purple-500" />
            <span>{product.quantity} {product.unit} available</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
            <span className="text-gray-500 ml-1">/{product.unit}</span>
          </div>
          {userType === 'buyer' && (
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </button>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-green-600" />
            <span>{product.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const AddProductForm = () => {
    const [newProduct, setNewProduct] = useState({
      name: '',
      price: '',
      quantity: '',
      unit: 'kg',
      category: 'vegetables',
      description: '',
      phone: ''
    });

    const handleSubmit = () => {
      alert('Product listed successfully! (Demo - would save to database)');
      setNewProduct({
        name: '',
        price: '',
        quantity: '',
        unit: 'kg',
        category: 'vegetables',
        description: '',
        phone: ''
      });
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">List New Product</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="kg">Kilogram</option>
                  <option value="liter">Liter</option>
                  <option value="piece">Piece</option>
                  <option value="dozen">Dozen</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                value={newProduct.phone}
                onChange={(e) => setNewProduct({...newProduct, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              List Product
            </button>
          </div>
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
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{item.image}</span>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.farmer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Qty: {item.cartQuantity}</span>
                    <span className="font-medium">₹{item.price * item.cartQuantity}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Total: ₹{getTotalPrice()}</span>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    placeholder="Search products or farmers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 mr-2 text-gray-500" />
                  Filters
                </button>
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