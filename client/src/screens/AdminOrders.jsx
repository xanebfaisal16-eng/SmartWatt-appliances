import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, processing, completed, cancelled

  // Load orders from localStorage
 useEffect(() => {
  const loadOrders = async () => {
    // Load from Supabase (CLOUD)
    try {
      const { data: cloudOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Merge with localStorage backup
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const allOrders = [...(cloudOrders || []), ...localOrders];
      
      // Remove duplicates
      const uniqueOrders = Array.from(
        new Map(allOrders.map(order => [order.id, order])).values()
      );
      
      setOrders(uniqueOrders);
    } catch (error) {
      console.error('Failed to load from Supabase:', error);
      // Fallback to localStorage
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(localOrders);
    }
  };

  loadOrders();
  
  // Auto-refresh every 10 seconds
  const interval = setInterval(loadOrders, 10000);
  return () => clearInterval(interval);
}, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus, updatedAt: new Date().toLocaleString() };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const deleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📦 Order Management</h1>
          <p className="text-gray-300">Monitor and manage all customer orders</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <p className="text-sm text-blue-300">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <p className="text-sm text-green-300">Total Revenue</p>
              <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-500/20 p-4 rounded-xl border border-yellow-400/30">
              <p className="text-sm text-yellow-300">Processing</p>
              <p className="text-3xl font-bold">
                {orders.filter(o => o.status === 'Processing').length}
              </p>
            </div>
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <p className="text-sm text-purple-300">Completed</p>
              <p className="text-3xl font-bold">
                {orders.filter(o => o.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          {['all', 'Processing', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === status 
                  ? 'bg-yellow-400 text-gray-900 font-bold' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-2xl text-gray-400">No orders found</p>
              <p className="text-gray-500 mt-2">Customer orders will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-left">Order ID</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Items</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="p-4">
                        <div className="font-mono font-bold">{order.id}</div>
                        <div className="text-sm text-gray-400">{order.customer.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{order.customer.name}</div>
                        <div className="text-sm text-gray-400">{order.customer.city}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.items[0]?.title || 'Product'}...
                        </div>
                      </td>
                      <td className="p-4 font-bold text-lg">${order.total.toFixed(2)}</td>
                      <td className="p-4">
                        <div>{order.date.split(',')[0]}</div>
                        <div className="text-sm text-gray-400">{order.date.split(',')[1]}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          order.status === 'Completed' ? 'bg-green-500/30 text-green-300' :
                          order.status === 'Processing' ? 'bg-yellow-500/30 text-yellow-300' :
                          'bg-red-500/30 text-red-300'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Processing')}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Completed')}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {filteredOrders.map((order) => (
          <div key={order.id} className="mt-4 bg-white/5 p-4 rounded-lg">
            <details>
              <summary className="cursor-pointer font-semibold text-lg">
                📋 View Details for {order.id}
              </summary>
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">👤 Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Name:</span> {order.customer.name}</p>
                    <p><span className="text-gray-400">Email:</span> {order.customer.email}</p>
                    <p><span className="text-gray-400">Address:</span> {order.customer.address}</p>
                    <p><span className="text-gray-400">City:</span> {order.customer.city}, ZIP: {order.customer.zipCode}</p>
                    <p><span className="text-gray-400">Payment:</span> **** **** **** {order.customer.cardNumber?.slice(-4)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">🛍️ Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.images?.[0] || 'https://via.placeholder.com/50'} 
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-gray-400">Qty: {item.quantity || 1}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</p>
                          <p className="text-sm text-gray-400">${item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;