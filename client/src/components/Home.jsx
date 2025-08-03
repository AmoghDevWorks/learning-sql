import React from 'react';
import { Upload, MessageSquare, LayoutDashboard, ShoppingCart, Users, Sprout } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Products",
      description: "Farmers can easily upload their fresh produce and agricultural products to reach customers directly.",
      userType: "For Farmers"
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot Assistant",
      description: "Get instant help and answers to your farming questions with our intelligent chatbot support.",
      userType: "24/7 Support"
    },
    {
      icon: LayoutDashboard,
      title: "Farmer Dashboard",
      description: "Manage your products, track sales, and monitor your farm business with an easy-to-use dashboard.",
      userType: "For Farmers"
    },
    {
      icon: ShoppingCart,
      title: "Buy Fresh Products",
      description: "Customers can browse and purchase fresh, quality produce directly from local farmers.",
      userType: "For Buyers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full shadow-lg">
              <Sprout className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Connect Farmers
            <span className="text-green-600 block">With Customers</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A simple platform where farmers can sell their products directly to customers, 
            with smart tools to help manage their business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Start Selling
            </button>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Browse Products
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-green-600" />
              </div>
              
              <div className="mb-2">
                <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
                  {feature.userType}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Farmers Join</h3>
              <p className="text-gray-600">Farmers sign up and create their profile on our platform</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Upload className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Products</h3>
              <p className="text-gray-600">Add photos and details of fresh produce to sell</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customers Buy</h3>
              <p className="text-gray-600">Users browse and purchase fresh products directly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;