import React, { useState } from 'react';
import { Package, Clock, User, MapPin, CheckCircle, Eye, IndianRupee, Phone } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import userContext from '../utils/UserContext';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const DeliveredProducts = () => {
  // Sample data - replace with actual API calls
  const [currentDelivery, setCurrentDelivery] = useState(null);

  const [previousDeliveries, setPreviousDeliveries] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [optModal, setOtpModal] = useState(null)
  const otpRef = useRef(null)

  const { user } = useContext(userContext)
  const navigate = useNavigate()

  const handleMarkDelivered = () => {
    axios.post('http://localhost:8000/volunteer/confirmDelivery',currentDelivery)
    .then(()=>{
      setOtpModal(true)
      alert('OTP sent successfully')
    })
    .catch((e)=>{
      alert('failed to generate otp')
      console.log(e)
      setOtpModal(false)
    })
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const confirmOTP = () => {
    const userOtp = otpRef.current.value

    axios.post(`http://localhost:8000/volunteer/confirmOTP?id=${currentDelivery.id}`,{
      userOtp:userOtp
    })
    .then(res => {
      alert(res.data.message || 'Delivery Successfull')
      navigate('/serveOrder')
    })
    .catch(res => {
      console.log(res)
      alert('failed')
    })
  }

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  useEffect(()=>{
    axios.get(`http://localhost:8000/volunteer/deliveredProducts?userId=${user}`)
    .then(results => {
        const data = results.data
        const temp = data.filter(d => d.delivered === 0)
        if(temp.length !==0) setCurrentDelivery(temp[0])
        setPreviousDeliveries(data.filter(d => d.delivered === 1))
    })
  },[])

  if(!previousDeliveries){
    return <Loader />
  }

  return (
    <div className="max-w-screen mx-auto p-6 bg-green-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Deliveries</h1>
        <p className="text-gray-600">Track your current and completed deliveries</p>
      </div>

      {/* Current Delivery Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-green-700" />
          Current Delivery
        </h2>
        
        {currentDelivery ? (
          <div className="bg-white rounded-lg shadow-md border border-green-200 overflow-hidden">
            <div className="bg-green-50 px-6 py-3 border-b border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Out for Delivery
                </span>
                <span className="text-sm text-green-600">
                  Assigned: {formatDateTime(currentDelivery.orderDate)}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Order #{currentDelivery.id}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {currentDelivery.consumerName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDateTime(currentDelivery.orderDate)}
                    </div>
                    <div className="flex items-center text-lg font-semibold text-gray-900">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {parseFloat(currentDelivery.totalRate).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                  <div className="flex items-start text-sm text-gray-600 mb-4">
                    <Phone className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{currentDelivery.consumerPhone}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(currentDelivery)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={handleMarkDelivered}
                      className="flex-1 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Delivered
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Delivery</h3>
            <p className="text-gray-500">You don't have any active deliveries at the moment.</p>
          </div>
        )}
      </div>

      {/* Previous Deliveries Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-gray-600" />
          Previous Deliveries ({previousDeliveries.length})
        </h2>
        
        {previousDeliveries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {previousDeliveries.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Delivered
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {order.consumerName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Delivered: {formatDateTime(order.orderDate)}
                    </div>
                    <div className="flex items-center text-lg font-semibold text-gray-900">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {parseFloat(order.totalRate).toFixed(2)}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Previous Deliveries</h3>
            <p className="text-gray-500">Your completed deliveries will appear here.</p>
          </div>
        )}
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

              {/* table section */}
              <table className="min-w-full border border-slate-300 rounded overflow-hidden text-center">
                <thead className="bg-green-400 text-slate-800">
                  <tr>
                    <th className="px-4 py-2 text-center border-b">Name</th>
                    <th className="px-4 py-2 text-center border-b">Quantity</th>
                    <th className="px-4 py-2 text-center border-b">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.details.map((ele, index) => (
                    <tr
                      key={index}
                      className="even:bg-green-200 odd:bg-white text-gray-800"
                    >
                      <td className="px-4 py-2 border-b">{ele.productName}</td>
                      <td className="px-4 py-2 border-b">{ele.quantity}</td>
                      <td className="px-4 py-2 border-b">{ele.farmerContact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {optModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Enter the OTP</h2>
                <button
                  onClick={()=>{setOtpModal(null)}}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* table section */}
              <input 
                placeholder='Enter the OTP'
                className='h-6 w-full px-4 py-6 border border-slate-800 rounded-lg'
                required
                ref={otpRef}
              />
              <button
                className='text-white bg-green-600 px-6 py-3 my-4 mx-auto text-lg font-semibold rounded-lg'
                onClick={confirmOTP}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveredProducts;