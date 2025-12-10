// src/utils/storage.js

/**
 * Save orders to localStorage with proper error handling
 */
export const saveOrdersToStorage = (orders) => {
  try {
    const ordersToSave = orders.map(order => ({
      ...order,
      lastUpdated: new Date().toISOString(),
      source: 'local-storage'
    }));
    
    localStorage.setItem('smartwatt_orders', JSON.stringify(ordersToSave));
    console.log(`✅ Saved ${ordersToSave.length} orders to localStorage`);
    return { success: true, count: ordersToSave.length };
  } catch (error) {
    console.error('❌ Failed to save orders to localStorage:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Load orders from localStorage with proper error handling
 */
export const loadOrdersFromStorage = () => {
  try {
    const storedOrders = localStorage.getItem('smartwatt_orders');
    if (!storedOrders) {
      console.log('📭 No orders found in localStorage');
      return [];
    }
    
    const orders = JSON.parse(storedOrders);
    console.log(`📂 Loaded ${orders.length} orders from localStorage`);
    return orders;
  } catch (error) {
    console.error('❌ Failed to load orders from localStorage:', error);
    return [];
  }
};

/**
 * Generate a unique order ID
 */
export const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

/**
 * Save products to localStorage
 */
export const saveProductsToStorage = (products) => {
  try {
    localStorage.setItem('smartwatt_products', JSON.stringify(products));
    console.log(`✅ Saved ${products.length} products to localStorage`);
    return true;
  } catch (error) {
    console.error('❌ Failed to save products:', error);
    return false;
  }
};

/**
 * Load products from localStorage
 */
export const loadProductsFromStorage = () => {
  try {
    const stored = localStorage.getItem('smartwatt_products');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('❌ Failed to load products:', error);
    return [];
  }
};

/**
 * Save cart items to localStorage
 */
export const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('smartwatt_cart', JSON.stringify(cartItems));
    return true;
  } catch (error) {
    console.error('❌ Failed to save cart:', error);
    return false;
  }
};

/**
 * Load cart items from localStorage
 */
export const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('smartwatt_cart');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('❌ Failed to load cart:', error);
    return [];
  }
};

/**
 * Create a sample order for testing
 */
export const createSampleOrder = () => {
  return {
    id: generateOrderId(),
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      address: '123 Energy Street',
      city: 'Eco City',
      zipCode: 'EC1001',
      phone: '+1 (555) 123-4567',
      customerId: 'CUST-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    },
    items: [
      {
        id: 'PROD-001',
        title: 'Smart Solar Panel 300W',
        price: 299.99,
        quantity: 2,
        images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'],
        category: 'Solar Energy',
        brand: 'SunPower',
        description: 'High-efficiency monocrystalline solar panel'
      },
      {
        id: 'PROD-002',
        title: 'Energy Monitor Pro',
        price: 149.99,
        quantity: 1,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w-400&h=300&fit=crop'],
        category: 'Monitoring',
        brand: 'Sense',
        description: 'Real-time energy consumption tracking device'
      }
    ],
    subtotal: (299.99 * 2 + 149.99).toFixed(2),
    tax: '59.50',
    shipping: '24.99',
    total: (299.99 * 2 + 149.99 + 59.50 + 24.99).toFixed(2),
    status: 'Processing',
    paymentMethod: 'Credit Card (**** 1234)',
    shippingMethod: 'Express Delivery (2-3 days)',
    date: new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    orderDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    notes: 'Customer requested installation guide and warranty information.',
    trackingNumber: 'TRK-' + Math.random().toString(36).substr(2, 10).toUpperCase()
  };
};

/**
 * Initialize with sample data if storage is empty
 */
export const initializeSampleData = () => {
  // Check if we already have data
  const existingOrders = loadOrdersFromStorage();
  const existingProducts = loadProductsFromStorage();
  
  if (existingOrders.length === 0) {
    // Create 3 sample orders
    const sampleOrders = [
      createSampleOrder(),
      {
        ...createSampleOrder(),
        id: generateOrderId(),
        status: 'Completed',
        customer: {
          name: 'Emma Johnson',
          email: 'emma.j@example.com',
          address: '456 Green Avenue',
          city: 'Solar City',
          zipCode: 'SC2002'
        }
      },
      {
        ...createSampleOrder(),
        id: generateOrderId(),
        status: 'Pending',
        customer: {
          name: 'Robert Chen',
          email: 'r.chen@example.com',
          address: '789 Eco Boulevard',
          city: 'Wind Valley',
          zipCode: 'WV3003'
        }
      }
    ];
    
    saveOrdersToStorage(sampleOrders);
    console.log('✅ Initialized with sample orders');
  }
  
  if (existingProducts.length === 0) {
    const sampleProducts = [
      {
        id: 'PROD-001',
        title: 'Smart Solar Panel 300W',
        price: 299.99,
        images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'],
        category: 'Solar Energy',
        brand: 'SunPower',
        stock: 45,
        rating: 4.8,
        ratingCount: 127,
        description: 'High-efficiency monocrystalline solar panel with 25-year warranty',
        features: ['300W Output', 'Monocrystalline Cells', 'Weather Resistant', '25-Year Warranty']
      },
      {
        id: 'PROD-002',
        title: 'Energy Monitor Pro',
        price: 149.99,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
        category: 'Monitoring',
        brand: 'Sense',
        stock: 32,
        rating: 4.5,
        ratingCount: 89,
        description: 'Real-time energy consumption tracking with mobile app',
        features: ['Real-time Monitoring', 'Mobile App', 'Energy Reports', 'Smart Alerts']
      },
      {
        id: 'PROD-003',
        title: 'Smart LED Bulb Pack (4 bulbs)',
        price: 39.99,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop'],
        category: 'Lighting',
        brand: 'Philips Hue',
        stock: 120,
        rating: 4.7,
        ratingCount: 256,
        description: 'Energy-efficient smart LED bulbs with app control',
        features: ['Voice Control', 'App Control', '16M Colors', 'Energy Saving']
      }
    ];
    
    saveProductsToStorage(sampleProducts);
    console.log('✅ Initialized with sample products');
  }
  
  return {
    orders: loadOrdersFromStorage(),
    products: loadProductsFromStorage()
  };
};

/**
 * Clear all storage data (for testing/reset)
 */
export const clearAllStorage = () => {
  localStorage.removeItem('smartwatt_orders');
  localStorage.removeItem('smartwatt_products');
  localStorage.removeItem('smartwatt_cart');
  console.log('🗑️  Cleared all SmartWatt storage');
  return true;
};

/**
 * Export all available storage keys for reference
 */
export const STORAGE_KEYS = {
  ORDERS: 'smartwatt_orders',
  PRODUCTS: 'smartwatt_products',
  CART: 'smartwatt_cart',
  USER: 'smartwatt_user',
  SETTINGS: 'smartwatt_settings'
};

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
  const orders = loadOrdersFromStorage();
  const products = loadProductsFromStorage();
  const cart = loadCartFromStorage();
  
  return {
    orders: {
      count: orders.length,
      totalValue: orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0).toFixed(2)
    },
    products: {
      count: products.length,
      categories: [...new Set(products.map(p => p.category))].length
    },
    cart: {
      items: cart.length,
      totalItems: cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    },
    storageUsed: {
      orders: JSON.stringify(orders).length,
      products: JSON.stringify(products).length,
      cart: JSON.stringify(cart).length
    }
  };
};

// Default export for convenience
export default {
  saveOrdersToStorage,
  loadOrdersFromStorage,
  generateOrderId,
  saveProductsToStorage,
  loadProductsFromStorage,
  saveCartToStorage,
  loadCartFromStorage,
  createSampleOrder,
  initializeSampleData,
  clearAllStorage,
  STORAGE_KEYS,
  getStorageStats
};