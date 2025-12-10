import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find order from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = savedOrders.find(o => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Order Not Found</h2>
          <p className="text-gray-300 mb-6">The order you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 inline-block"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-300">Thank you for your purchase. Your order is being processed.</p>
          <div className="mt-4 bg-yellow-400/20 inline-block px-6 py-2 rounded-full border border-yellow-400/30">
            <p className="text-yellow-300 font-bold">Order ID: {order.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">📦 Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.images?.[0] || 'https://via.placeholder.com/60'} 
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-gray-300">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="font-bold text-white">${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-4 space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>{order.total > 50 ? 'FREE' : '$9.99'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white border-t border-white/20 pt-3">
                <span>Total Paid</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Next Steps */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">🚚 Shipping Information</h2>
              <div className="space-y-3">
                <p><span className="text-gray-400">Name:</span> {order.customer.name}</p>
                <p><span className="text-gray-400">Email:</span> {order.customer.email}</p>
                <p><span className="text-gray-400">Address:</span> {order.customer.address}</p>
                <p><span className="text-gray-400">City:</span> {order.customer.city}, {order.customer.zipCode}</p>
                <p className="mt-4 text-yellow-300">📧 Order confirmation sent to {order.customer.email}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">📋 What's Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/30 w-8 h-8 rounded-full flex items-center justify-center">1</div>
                  <div>
                    <p className="font-semibold text-white">Order Processing</p>
                    <p className="text-sm text-gray-300">We're preparing your order for shipment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-500/30 w-8 h-8 rounded-full flex items-center justify-center">2</div>
                  <div>
                    <p className="font-semibold text-white">Shipping</p>
                    <p className="text-sm text-gray-300">Your order will be shipped within 2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/30 w-8 h-8 rounded-full flex items-center justify-center">3</div>
                  <div>
                    <p className="font-semibold text-white">Delivery</p>
                    <p className="text-sm text-gray-300">Expected delivery: 5-7 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/products"
            className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 text-center"
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;