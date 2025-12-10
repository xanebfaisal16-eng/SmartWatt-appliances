// screens/AdminOverview.jsx
import React, { useState } from 'react';
import { FiUsers, FiShoppingBag, FiDollarSign, FiMessageSquare, FiTrendingUp, FiPackage } from 'react-icons/fi';

const AdminOverview = () => {
  const [stats] = useState({
    totalUsers: 1248,
    totalOrders: 342,
    totalRevenue: 45299,
    pendingMessages: 18,
    conversionRate: '3.2%',
    avgOrderValue: '$132.45'
  });

  const [recentOrders] = useState([
    { id: 'SW2456', customer: 'Alex Johnson', amount: 299.99, status: 'Delivered', date: '2024-03-15' },
    { id: 'SW2457', customer: 'Sarah Miller', amount: 159.98, status: 'Processing', date: '2024-03-15' },
    { id: 'SW2458', customer: 'Mike Wilson', amount: 89.99, status: 'Shipped', date: '2024-03-14' },
    { id: 'SW2459', customer: 'Emma Davis', amount: 449.97, status: 'Pending', date: '2024-03-14' },
  ]);

  const [topProducts] = useState([
    { name: 'Smartwatch Pro X', sales: 142, revenue: 42558, stock: 45 },
    { name: 'Fitness Band Lite', sales: 89, revenue: 8011, stock: 32 },
    { name: 'Wireless Charger', sales: 67, revenue: 4623, stock: 78 },
    { name: 'Premium Leather Band', sales: 54, revenue: 2696, stock: 12 },
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Overview</h1>
        <p className="text-gray-300">Monitor your Smartwat store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-800/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <FiUsers className="text-blue-400 text-xl" />
            </div>
          </div>
          <p className="text-green-400 text-sm mt-3">↑ 12% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-emerald-800/20 backdrop-blur-lg rounded-2xl p-6 border border-emerald-800/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
              <FiShoppingBag className="text-green-400 text-xl" />
            </div>
          </div>
          <p className="text-green-400 text-sm mt-3">↑ 8% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-800/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
              <FiDollarSign className="text-purple-400 text-xl" />
            </div>
          </div>
          <p className="text-green-400 text-sm mt-3">↑ 15% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-800/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending Messages</p>
              <p className="text-2xl font-bold">{stats.pendingMessages}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 flex items-center justify-center">
              <FiMessageSquare className="text-orange-400 text-xl" />
            </div>
          </div>
          <p className="text-red-400 text-sm mt-3">Requires attention</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 backdrop-blur-lg rounded-2xl p-6 border border-cyan-800/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold">{stats.conversionRate}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 flex items-center justify-center">
              <FiTrendingUp className="text-cyan-400 text-xl" />
            </div>
          </div>
          <p className="text-green-400 text-sm mt-3">↑ 0.4% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 backdrop-blur-lg rounded-2xl p-6 border border-pink-800/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold">{stats.avgOrderValue}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-600/20 flex items-center justify-center">
              <FiPackage className="text-pink-400 text-xl" />
            </div>
          </div>
          <p className="text-green-400 text-sm mt-3">↑ $12.30 from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-gray-400 text-sm">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${order.amount.toFixed(2)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'Delivered' ? 'bg-green-600/20 text-green-400' :
                    order.status === 'Processing' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Top Products</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                    <FiPackage className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">Stock: {product.stock} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${product.revenue.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">{product.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700/50">
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-white text-2xl" />
            </div>
            <p className="font-semibold">Add Product</p>
          </button>
          <button className="p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="text-white text-2xl" />
            </div>
            <p className="font-semibold">Manage Orders</p>
          </button>
          <button className="p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
              <FiUsers className="text-white text-2xl" />
            </div>
            <p className="font-semibold">View Users</p>
          </button>
          <button className="p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center mx-auto mb-4">
              <FiMessageSquare className="text-white text-2xl" />
            </div>
            <p className="font-semibold">Check Messages</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;