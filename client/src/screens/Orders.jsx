// screens/Orders.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([
    { 
      _id: 'ORD001', 
      date: '2024-03-15', 
      total: 299.99, 
      status: 'Delivered', 
      items: [
        { name: 'Smartwatch Pro X', quantity: 1, price: 299.99 }
      ],
      trackingNumber: 'TRK789456123',
      estimatedDelivery: '2024-03-18'
    },
    { 
      _id: 'ORD002', 
      date: '2024-03-10', 
      total: 159.98, 
      status: 'Processing', 
      items: [
        { name: 'Fitness Band Lite', quantity: 1, price: 89.99 },
        { name: 'Wireless Charger', quantity: 1, price: 69.99 }
      ],
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-03-25'
    },
    { 
      _id: 'ORD003', 
      date: '2024-02-28', 
      total: 129.99, 
      status: 'Delivered', 
      items: [
        { name: 'Smartwatch Band Pack', quantity: 1, price: 129.99 }
      ],
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-03-05'
    }
  ]);

  // In real app, fetch orders from API
  // useEffect(() => {
  //   fetch('/api/orders')
  //     .then(res => res.json())
  //     .then(data => setOrders(data))
  // }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-900/30 text-green-400';
      case 'Processing': return 'bg-yellow-900/30 text-yellow-400';
      case 'Shipped': return 'bg-blue-900/30 text-blue-400';
      case 'Cancelled': return 'bg-red-900/30 text-red-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Order History</h1>
        <p className="text-gray-300">Track and manage your smartwatch orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-12 border border-gray-700 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-bold mb-2">No orders yet</h3>
          <p className="text-gray-400 mb-6">Start shopping for smartwatches and accessories!</p>
          <Link 
            to="/products" 
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-gray-700">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-bold">Order #{order._id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">Placed on {order.date}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">{order.items.length} item(s)</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Items</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-gray-700">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Tracking:</span> {order.trackingNumber}
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Est. Delivery:</span> {order.estimatedDelivery}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link 
                    to={`/order-confirmation/${order._id}`}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
                  >
                    View Details
                  </Link>
                  {order.status === 'Delivered' && (
                    <button className="px-5 py-2.5 border border-gray-600 hover:bg-gray-700 rounded-lg font-medium transition">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;