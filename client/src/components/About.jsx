import React from 'react';
import { Heart, Users, Sprout, Target, Award, TrendingUp, MessageSquare, Handshake } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Supporting Farmers",
      description: "We believe in empowering farmers by providing them direct access to customers, ensuring fair prices for their hard work."
    },
    {
      icon: Users,
      title: "Fresh for Everyone",
      description: "Connecting customers with the freshest produce while building stronger relationships between farmers and communities."
    },
    {
      icon: Sprout,
      title: "Sustainable Agriculture",
      description: "Promoting sustainable farming practices and reducing food waste through efficient direct-to-consumer sales."
    },
    {
      icon: Handshake,
      title: "Trust & Transparency",
      description: "Building trust through transparent transactions and honest communication between farmers and buyers."
    }
  ];

  const stats = [
    { number: "500+", label: "Active Farmers" },
    { number: "10,000+", label: "Happy Customers" },
    { number: "50,000+", label: "Products Sold" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Mission</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Bridging the gap between farmers and customers through technology, 
            creating a sustainable marketplace for fresh, quality produce.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We started with a simple observation: farmers work incredibly hard to grow fresh, 
                  quality produce, but often struggle to reach customers directly. Meanwhile, 
                  customers want access to fresh, local products but find it difficult to connect 
                  with farmers in their area.
                </p>
                <p>
                  Our platform was born from the idea that technology could solve this problem. 
                  By creating a simple, user-friendly marketplace, we enable farmers to showcase 
                  their products directly to customers, cutting out middlemen and ensuring fair 
                  prices for everyone.
                </p>
                <p>
                  With features like easy product uploads, an AI chatbot for support, and 
                  comprehensive dashboards for farm management, we're making it easier than 
                  ever for farmers to run their business and for customers to access fresh, 
                  local produce.
                </p>
              </div>
            </div>
            <div className="bg-green-100 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                    <div className="text-gray-700 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do in building a better farming community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To create a direct connection between farmers and customers, ensuring fresh produce 
                reaches tables while supporting local agriculture.
              </p>
            </div>
            
            <div className="text-center">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600">
                A world where every farmer has access to fair markets and every customer can 
                easily find fresh, local produce from trusted sources.
              </p>
            </div>
            
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Impact</h3>
              <p className="text-gray-600">
                Increasing farmer income, reducing food waste, and building stronger communities 
                through sustainable agricultural practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-gray-600">Simple tools designed specifically for farmers and their customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Product Upload</h3>
              <p className="text-gray-600">
                Farmers can quickly upload their products with photos and descriptions, 
                making it simple to showcase their harvest.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Chatbot Support</h3>
              <p className="text-gray-600">
                Get instant help and answers with our intelligent chatbot, available 24/7 
                to assist both farmers and customers.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Direct Connection</h3>
              <p className="text-gray-600">
                No middlemen - customers buy directly from farmers, ensuring fair prices 
                and fresher produce for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking to sell your produce or a customer seeking fresh, 
            local products, we're here to connect you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Start Selling Today
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;