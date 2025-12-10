import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TbHeartFilled, 
  TbHeartBroken, 
  TbTrash, 
  TbShoppingCart,
  TbRefresh,
  TbCloud,
  TbCloudOff,
  TbDeviceDesktop,
  TbDeviceMobile,
  TbCheck,
  TbAlertCircle
} from 'react-icons/tb';
import axios from 'axios';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [syncStatus, setSyncStatus] = useState({
    lastSync: null,
    pendingChanges: 0,
    devices: [],
    error: null
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  // API base URL - adjust according to your backend
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Create axios instance with auth interceptor
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  // Load wishlist from backend API with offline support
  const loadWishlist = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Load from localStorage if not logged in
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist_guest')) || [];
        setWishlist(savedWishlist);
        return;
      }

      if (!offline) {
        // Fetch from backend API
        const response = await api.get('/api/wishlist');
        const wishlistData = response.data.wishlist || [];
        
        // Save to localStorage for offline access
        localStorage.setItem(`wishlist_${getUserId()}`, JSON.stringify(wishlistData));
        
        // Check for offline changes
        const offlineChanges = getOfflineChanges();
        if (offlineChanges.length > 0) {
          // Apply offline changes
          await syncOfflineChanges(offlineChanges, wishlistData);
        } else {
          setWishlist(wishlistData);
        }
        
        // Load connected devices
        await loadConnectedDevices();
        
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          pendingChanges: offlineChanges.length,
          error: null
        }));
      } else {
        // Load from localStorage when offline
        const cachedWishlist = JSON.parse(localStorage.getItem(`wishlist_${getUserId()}`)) || [];
        setWishlist(cachedWishlist);
        
        const offlineChanges = getOfflineChanges();
        setSyncStatus(prev => ({
          ...prev,
          pendingChanges: offlineChanges.length,
          error: 'You are offline. Changes will sync when you reconnect.'
        }));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      
      // Fallback to localStorage
      const cachedWishlist = JSON.parse(localStorage.getItem(`wishlist_${getUserId()}`)) || 
                            JSON.parse(localStorage.getItem('wishlist_guest')) || [];
      setWishlist(cachedWishlist);
      
      setSyncStatus(prev => ({
        ...prev,
        error: error.message
      }));
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [offline, navigate]);

  // Initial load and setup
  useEffect(() => {
    loadWishlist();
    
    // Set up network listeners
    const handleOnline = () => {
      setOffline(false);
      syncNow();
      showNotification('Back online! Syncing your wishlist...', 'success');
    };
    
    const handleOffline = () => {
      setOffline(true);
      showNotification('You are offline. Changes saved locally.', 'warning');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Periodic sync (every 30 seconds)
    const syncInterval = setInterval(() => {
      if (!offline && !syncing) {
        syncNow();
      }
    }, 30000);
    
    // Listen for cross-device updates
    setupCrossDeviceListener();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, [loadWishlist, offline, syncing]);

  // Helper functions
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?._id || 'guest';
  };

  const getOfflineChanges = () => {
    const userId = getUserId();
    return JSON.parse(localStorage.getItem(`wishlist_offline_${userId}`)) || [];
  };

  const addOfflineChange = (type, productId, data = null) => {
    const userId = getUserId();
    const changes = getOfflineChanges();
    
    changes.push({
      type,
      productId,
      data,
      timestamp: new Date().toISOString(),
      deviceId: localStorage.getItem('deviceId') || 'unknown'
    });
    
    localStorage.setItem(`wishlist_offline_${userId}`, JSON.stringify(changes));
    
    setSyncStatus(prev => ({
      ...prev,
      pendingChanges: changes.length
    }));
  };

  const clearOfflineChanges = () => {
    const userId = getUserId();
    localStorage.removeItem(`wishlist_offline_${userId}`);
    setSyncStatus(prev => ({
      ...prev,
      pendingChanges: 0
    }));
  };

  const syncOfflineChanges = async (changes, currentWishlist) => {
    try {
      const operations = changes.map(change => ({
        type: change.type,
        productId: change.productId,
        data: change.data
      }));
      
      const response = await api.post('/api/wishlist/batch', { operations });
      clearOfflineChanges();
      
      // Update with server response
      const updatedWishlist = response.data.wishlist || currentWishlist;
      setWishlist(updatedWishlist);
      localStorage.setItem(`wishlist_${getUserId()}`, JSON.stringify(updatedWishlist));
      
      return updatedWishlist;
    } catch (error) {
      console.error('Failed to sync offline changes:', error);
      throw error;
    }
  };

  const loadConnectedDevices = async () => {
    try {
      // This would call your backend endpoint to get connected devices
      // For now, we'll simulate it
      const mockDevices = [
        { id: 'device1', name: 'Chrome on Windows', type: 'desktop', lastActive: new Date() },
        { id: 'device2', name: 'Safari on iPhone', type: 'mobile', lastActive: new Date(Date.now() - 3600000) }
      ];
      
      setSyncStatus(prev => ({
        ...prev,
        devices: mockDevices
      }));
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const setupCrossDeviceListener = () => {
    // This would set up WebSocket or polling for real-time updates
    // For now, we'll use localStorage events as a simple cross-tab sync
    window.addEventListener('storage', (e) => {
      if (e.key === `wishlist_update_${getUserId()}`) {
        const update = JSON.parse(e.newValue);
        if (update) {
          setWishlist(update.wishlist);
          showNotification('Wishlist updated from another device', 'info');
        }
      }
    });
  };

  const syncNow = async () => {
    if (syncing || offline) return;
    
    setSyncing(true);
    
    try {
      const offlineChanges = getOfflineChanges();
      
      if (offlineChanges.length > 0) {
        // Sync offline changes
        await syncOfflineChanges(offlineChanges, wishlist);
        showNotification('Wishlist synchronized!', 'success');
      } else {
        // Just refresh from server
        await loadWishlist(false);
        showNotification('Wishlist refreshed', 'info');
      }
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        error: null
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(prev => ({
        ...prev,
        error: error.message
      }));
    } finally {
      setSyncing(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    // You can replace this with a proper notification system
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  // Add to wishlist
  const addToWishlist = async (product) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Save locally for guest users
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist_guest')) || [];
        const updatedWishlist = [...savedWishlist, product];
        localStorage.setItem('wishlist_guest', JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
        showNotification('Added to local wishlist. Sign in to sync across devices.', 'info');
        return;
      }

      if (offline) {
        // Save offline change
        addOfflineChange('add', product._id, product);
        
        // Update local state
        const updatedWishlist = [...wishlist, product];
        setWishlist(updatedWishlist);
        localStorage.setItem(`wishlist_${getUserId()}`, JSON.stringify(updatedWishlist));
        
        showNotification('Saved locally. Will sync when online.', 'info');
      } else {
        // Call backend API
        await api.post(`/api/wishlist/add/${product._id}`);
        
        // Update local state
        const updatedWishlist = [...wishlist, product];
        setWishlist(updatedWishlist);
        localStorage.setItem(`wishlist_${getUserId()}`, JSON.stringify(updatedWishlist));
        
        // Notify other tabs/devices
        localStorage.setItem(`wishlist_update_${getUserId()}`, JSON.stringify({
          wishlist: updatedWishlist,
          timestamp: new Date().toISOString()
        }));
        
        showNotification('Added to wishlist!', 'success');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showNotification('Failed to add to wishlist', 'error');
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Remove locally for guest users
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist_guest')) || [];
        const updatedWishlist = savedWishlist.filter(item => item._id !== productId);
        localStorage.setItem('wishlist_guest', JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
        showNotification('Removed from local wishlist', 'info');
        return;
      }

      if (offline) {
        // Save offline change
        addOfflineChange('remove', productId);
        
        // Update local state
        const updatedWishlist = wishlist.filter(item => item._id !== productId);
        setWishlist(updatedWishlist);
        localStorage.setItem(`wishlist_${getUserId()}`, JSON.stringify(updatedWishlist));
        
        showNotification('Removed locally. Will sync when online.', 'info');
      } else {
        // Call backend API
        await api.delete(`/api/wishlist/remove/${productId}`);
        
        // Update local state
        const updatedWishlist = wishlist.filter(item => item._id !== productId);
        setWishlist(updatedWishlist);
        localStorage.setItem(`wishlist_${getUserId()}`, JSON.stringify(updatedWishlist));
        
        // Notify other tabs/devices
        localStorage.setItem(`wishlist_update_${getUserId()}`, JSON.stringify({
          wishlist: updatedWishlist,
          timestamp: new Date().toISOString()
        }));
        
        showNotification('Removed from wishlist', 'success');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showNotification('Failed to remove from wishlist', 'error');
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!window.confirm('Are you sure you want to clear your entire wishlist?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        localStorage.setItem('wishlist_guest', JSON.stringify([]));
        setWishlist([]);
        showNotification('Wishlist cleared', 'info');
        return;
      }

      if (offline) {
        // Save offline changes for each item
        wishlist.forEach(item => {
          addOfflineChange('remove', item._id);
        });
        
        setWishlist([]);
        localStorage.setItem(`wishlist_${getUserId()}`, JSON.stringify([]));
        
        showNotification('Cleared locally. Will sync when online.', 'info');
      } else {
        // Remove each item from backend
        await Promise.all(
          wishlist.map(item => 
            api.delete(`/api/wishlist/remove/${item._id}`)
          )
        );
        
        setWishlist([]);
        localStorage.setItem(`wishlist_${getUserId()}`, JSON.stringify([]));
        
        // Notify other tabs/devices
        localStorage.setItem(`wishlist_update_${getUserId()}`, JSON.stringify({
          wishlist: [],
          timestamp: new Date().toISOString()
        }));
        
        showNotification('Wishlist cleared', 'success');
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      showNotification('Failed to clear wishlist', 'error');
    }
  };

  // Add to cart from wishlist
  const addToCartFromWishlist = (product) => {
    // Implement your cart logic here
    showNotification(`Added "${product.title}" to cart!`, 'success');
  };

  // Handle item selection
  const toggleItemSelection = (productId) => {
    setSelectedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Batch remove selected items
  const batchRemoveItems = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      await Promise.all(
        selectedItems.map(productId => removeFromWishlist(productId))
      );
      setSelectedItems([]);
    } catch (error) {
      console.error('Error batch removing items:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with sync status */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                {syncStatus.lastSync && (
                  <span className="ml-4 text-sm">
                    Last sync: {new Date(syncStatus.lastSync).toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Sync Status Indicator */}
              <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                offline 
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                  : syncStatus.error
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-green-50 text-green-800 border border-green-200'
              }`}>
                {offline ? (
                  <>
                    <TbCloudOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Offline</span>
                  </>
                ) : syncStatus.error ? (
                  <>
                    <TbAlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Sync Error</span>
                  </>
                ) : (
                  <>
                    <TbCloud className="w-4 h-4" />
                    <span className="text-sm font-medium">Synced</span>
                  </>
                )}
                
                {syncStatus.pendingChanges > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {syncStatus.pendingChanges} pending
                  </span>
                )}
              </div>
              
              {/* Sync Button */}
              <button
                onClick={syncNow}
                disabled={syncing || offline}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  syncing || offline
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <TbRefresh className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
              
              {/* Connected Devices */}
              {syncStatus.devices.length > 0 && (
                <div className="relative group">
                  <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100">
                    <TbDeviceDesktop className="w-4 h-4" />
                    <span>{syncStatus.devices.length} device{syncStatus.devices.length !== 1 ? 's' : ''}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 hidden group-hover:block z-10">
                    <p className="text-sm font-medium text-gray-900 mb-2">Connected Devices:</p>
                    {syncStatus.devices.map(device => (
                      <div key={device.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          {device.type === 'mobile' ? (
                            <TbDeviceMobile className="w-4 h-4 text-gray-500" />
                          ) : (
                            <TbDeviceDesktop className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-sm text-gray-700">{device.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(device.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {wishlist.length > 0 && (
                <>
                  {selectedItems.length > 0 && (
                    <button
                      onClick={batchRemoveItems}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <TbTrash className="w-4 h-4" />
                      Remove Selected ({selectedItems.length})
                    </button>
                  )}
                  
                  <button
                    onClick={clearWishlist}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <TbTrash className="w-4 h-4" />
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Sync Error Message */}
          {syncStatus.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <TbAlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm">{syncStatus.error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <TbHeartBroken className="w-20 h-20 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {offline 
                ? "You're offline. Sign in when online to sync your wishlist across devices."
                : "Start adding products you love! Click the heart icon on any product to save it here."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 inline-block"
              >
                Browse Products
              </Link>
              {!localStorage.getItem('token') && (
                <Link
                  to="/login"
                  className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 inline-block"
                >
                  Sign In to Sync
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Batch Actions */}
            {selectedItems.length > 0 && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TbCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-blue-800 font-medium">
                      {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedItems([])}
                      className="px-4 py-2 text-blue-700 font-medium hover:text-blue-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={batchRemoveItems}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <TbTrash className="w-4 h-4" />
                      Remove Selected
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-300">
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => toggleItemSelection(item._id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-50">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/300'}
                      alt={item.title}
                      className="w-full h-full object-contain p-4"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110"
                        aria-label="Remove from wishlist"
                      >
                        <TbHeartFilled className="w-5 h-5 text-red-500 fill-red-500" />
                      </button>
                    </div>
                    {item._isOffline && (
                      <div className="absolute bottom-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Offline
                      </div>
                    )}
                    {item.stock < 1 && (
                      <div className="absolute top-3 left-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-medium">{item.category}</span>
                        <Link to={`/product/${item._id}`}>
                          <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2 hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <TbHeartFilled
                              key={i}
                              className={`w-4 h-4 ${i < (item.ratings || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({item.ratings || 0})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.stock > 0 ? (
                          <button
                            onClick={() => addToCartFromWishlist(item)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2"
                          >
                            <TbShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        ) : (
                          <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Sync Warning for Guest Users */}
            {!localStorage.getItem('token') && (
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <TbCloudOff className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h4 className="font-bold text-yellow-800">Wishlist stored locally</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Sign in to sync your wishlist across all your devices and never lose your saved items.
                    </p>
                    <Link
                      to="/login"
                      className="mt-3 inline-block px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg font-medium hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300"
                    >
                      Sign In to Enable Sync
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;