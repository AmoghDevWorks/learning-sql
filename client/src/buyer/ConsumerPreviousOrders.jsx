import React, { useContext, useEffect, useState } from 'react'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import userContext from '../utils/UserContext'
import axios from 'axios'

const ConsumerPreviousOrders = () => {
  const [activeTab, setActiveTab] = useState('current')
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Mock data for orders
  const [ currentOrders,setCurrentOrders ] = useState([])
  const [ previousOrders,setPreviousOrders ] = useState([])

  const { user } = useContext(userContext)

  const getStatusColor = (deliveryAssigned, delivered) => {
    if (delivered) {
        return {
        content: 'Delivered',
        css: 'bg-green-50 text-green-700 border border-green-200'
        };
    } else if (deliveryAssigned === null) {
        return {
        content: 'Pending',
        css: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        };
    } else {
        return {
        content: 'Out for delivery',
        css: 'bg-blue-50 text-blue-700 border border-blue-200'
        };
    }
  };


  useEffect(()=>{
    axios.get(`http://localhost:8000/consumer/previousAndCurrentOrders?userId=${user}`)
    .then(results => {
        console.log(results)
        setCurrentOrders(results.data.filter(order => order.delivered === 0))
        setPreviousOrders(results.data.filter(order => order.delivered === 1))
    })
    .catch(err => {
        alert('failed to fetch')
    })
  },[])

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-lg border border-green-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-black">Order #{order.id}</h3>
          <p className="text-sm text-slate-950">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-2 ${getStatusColor(order.deliveryAssigned,order.delivered).css}`}>
            {order.delivered === 1 && <CheckCircle className="w-4 h-4 mr-2" />}
            <span className="capitalize">{getStatusColor(order.deliveryAssigned,order.delivered).content}</span>
          </div>
          <p className="font-bold text-lg text-slate-900">₹{parseFloat(order.totalRate).toFixed(2)}</p>
        </div>
      </div>

      <div className="border-t border-green-200 pt-4 mt-4 flex justify-between items-center">
        <div className="text-sm text-slate-6600">
          {order.delivered === 1 && order.orderDate && (
            <p>Delivered on {new Date(order.orderDate).toLocaleDateString()}</p>
          )}
          <p>{order.details.length} item{order.details.length > 1 ? 's' : ''} ordered</p>
        </div>
        <button
          onClick={() => setSelectedOrder(order)}
          className="flex items-center px-4 py-2 text-sm font-medium text-black bg-green-50 border border-green-300 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
      </div>
    </div>
  )

  const OrderModal = ({ order, onClose }) => {
    if (!order) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-black">Order {order.id}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-black mb-2">Order Status</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-green-50 text-green-700 border-green-200 ${getStatusColor(order.deliveryAssigned,order.delivered).css}`}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="capitalize">{getStatusColor(order.deliveryAssigned,order.delivered).content}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-2">Order Date</h3>
                <p className="text-slate-700">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-green-900 mb-4">Items Ordered</h3>
              <table className="min-w-full border border-slate-300 rounded overflow-hidden text-center">
                <thead className="bg-green-400 text-slate-800">
                  <tr>
                    <th className="px-4 py-2 text-center border-b">Name</th>
                    <th className="px-4 py-2 text-center border-b">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.details.map((ele, index) => (
                    <tr
                      key={index}
                      className="even:bg-green-200 odd:bg-white text-gray-800"
                    >
                      <td className="px-4 py-2 border-b">{ele.productName}</td>
                      <td className="px-4 py-2 border-b">{ele.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-green-200 pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-green-900">
                <span>Total Amount:</span>
                <span>₹{parseFloat(order.totalRate).toFixed(2)}</span>
              </div>
            </div>

            {order.delivered === 1 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 font-medium">
                  ✅ Delivered on {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const orders = activeTab === 'current' ? currentOrders : previousOrders

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">My Orders</h1>
          <p className="text-slate-700">View your current orders and order history</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 border border-green-200">
          <div className="border-b border-green-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('current')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'current'
                    ? 'border-green-500 text-black'
                    : 'border-transparent text-slate-600 hover:text-slate-950 hover:border-green-300'
                }`}
              >
                Current Orders ({currentOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('previous')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'previous'
                    ? 'border-green-500 text-black'
                    : 'border-transparent text-slate-600 hover:text-slate-950 hover:border-green-300'
                }`}
              >
                Order History ({previousOrders.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg border border-green-200 p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-medium text-green-900 mb-2">
                {activeTab === 'current' ? 'No Current Orders' : 'No Previous Orders'}
              </h3>
              <p className="text-green-600">
                {activeTab === 'current'
                  ? 'You don\'t have any active orders at the moment.'
                  : 'You haven\'t placed any orders yet.'}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  )
}

export default ConsumerPreviousOrders