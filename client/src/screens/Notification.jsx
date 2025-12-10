// screens/Notifications.jsx
import React, { useState } from 'react';
import { 
  FiBell, FiFilter, FiCheckCircle, FiTrash2,
  FiSettings, FiX
} from 'react-icons/fi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Status Updated',
      message: 'Your recent order has been processed successfully.',
      time: '2 hours ago',
      read: false,
      type: 'order'
    },
    {
      id: 2,
      title: 'Account Security',
      message: 'Your account security settings have been updated.',
      time: '5 hours ago',
      read: false,
      type: 'security'
    },
    {
      id: 3,
      title: 'New Feature Available',
      message: 'Check out the latest dashboard features.',
      time: '1 day ago',
      read: true,
      type: 'system'
    },
    {
      id: 4,
      title: 'Profile Update Reminder',
      message: 'Complete your profile for better recommendations.',
      time: '2 days ago',
      read: true,
      type: 'account'
    },
    {
      id: 5,
      title: 'Payment Method Added',
      message: 'A new payment method was added to your account.',
      time: '3 days ago',
      read: true,
      type: 'payment'
    },
    {
      id: 6,
      title: 'Shipping Update',
      message: 'Your package is on its way to the destination.',
      time: '1 week ago',
      read: true,
      type: 'shipping'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type) => {
    switch(type) {
      case 'order': return '📦';
      case 'security': return '🔒';
      case 'system': return '🔄';
      case 'account': return '👤';
      case 'payment': return '💳';
      case 'shipping': return '🚚';
      default: return '📢';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'order': return 'border-l-green-500';
      case 'security': return 'border-l-blue-500';
      case 'system': return 'border-l-purple-500';
      case 'account': return 'border-l-pink-500';
      case 'payment': return 'border-l-yellow-500';
      case 'shipping': return 'border-l-cyan-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-gray-400 mt-1">Manage your notification preferences</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition flex items-center gap-2"
            >
              <FiCheckCircle />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Total Notifications</p>
          <p className="text-2xl font-bold">{notifications.length}</p>
        </div>
        <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/50">
          <p className="text-blue-400 text-sm">Unread</p>
          <p className="text-2xl font-bold text-blue-400">{unreadCount}</p>
        </div>
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Types</p>
          <p className="text-2xl font-bold">{new Set(notifications.map(n => n.type)).size}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <FiFilter />
            <span className="text-sm">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'unread', 'order', 'security', 'system'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border-l-4 ${getTypeColor(notification.type)} border border-gray-700/50 hover:border-gray-600/70 transition`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-2xl">
                  {getTypeIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-semibold ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-gray-400 mt-1 text-sm">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {notification.time}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-700/50">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <FiCheckCircle className="text-sm" />
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1"
                    >
                      <FiTrash2 className="text-sm" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <FiBell className="text-gray-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">No notifications</h3>
            <p className="text-gray-400">You're all caught up!</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {notifications.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-800/50 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </p>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-700/30 text-red-300 rounded-lg transition flex items-center gap-2"
          >
            <FiTrash2 />
            Clear All
          </button>
        </div>
      )}

      {/* Settings */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notification Settings</h3>
          <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
            <FiSettings />
            Manage
          </button>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm mb-2">Configure your notification preferences</p>
          <div className="space-y-3">
            {['Email notifications', 'Push notifications', 'Order updates', 'Security alerts'].map((setting) => (
              <div key={setting} className="flex items-center justify-between">
                <span className="text-gray-300">{setting}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;