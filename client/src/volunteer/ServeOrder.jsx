import React, { useState } from 'react';
import { Eye, Package, User, Clock, DollarSign } from 'lucide-react';
import Loader from '../components/Loader';
import { useEffect } from 'react';
import axios from 'axios';

const ServeOrder = () => {
  const [orders, setOrders] = useState();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTakeDelivery = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, deliveryAssigned: true }
        : order
    ));
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

//   useEffect(()=>{
//     axios.get('http://localhost:8000/volunteer/')
//   },[])

  if(!orders){
    return(
        <Loader />
    )
  }

  if(orders.length === 0){
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-xl px-8 py-6 text-center border border-gray-300">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Orders Available
                </h2>
                <p className="text-sm text-gray-500">
                There are currently no orders in your district. Please check back later.
                </p>
            </div>
        </div>
    )
  }

  return (
    <div className="mx-auto p-6 bg-green-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Order #{order.id}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <User className="w-4 h-4 mr-1" />
                  {order.customerName}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDateTime(order.orderDate)}
                </div>
                <div className="flex items-center text-lg font-semibold text-gray-900">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {order.totalRate.toFixed(2)}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(order)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => handleTakeDelivery(order.id)}
                  className="flex-1 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Take Delivery
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order ID</h3>
                  <p className="text-gray-600">#{selectedOrder.id}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Consumer ID</h3>
                  <p className="text-gray-600">{selectedOrder.consumerId}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Customer</h3>
                  <p className="text-gray-600">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 text-sm">{selectedOrder.customerPhone}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order Date</h3>
                  <p className="text-gray-600">{formatDateTime(selectedOrder.orderDate)}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Total Amount</h3>
                  <p className="text-lg font-bold text-gray-900">${selectedOrder.totalRate.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServeOrder;