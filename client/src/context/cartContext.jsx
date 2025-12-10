import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // ========== 1. GET CURRENT USER (Memoized) ==========
  const getCurrentUser = useCallback(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }, []);

  // ========== 2. GET CART KEY (Memoized) ==========
  const getCartKey = useCallback(() => {
    const user = getCurrentUser();
    if (user && user._id) {
      return `smartwatt-cart-${user._id}`;
    }
    return 'smartwatt-cart-guest';
  }, [getCurrentUser]);

  // ========== 3. CART PERSISTENCE ==========
  const [items, setItems] = useState(() => {
    try {
      const cartKey = getCartKey();
      const savedCart = localStorage.getItem(cartKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      return [];
    }
  });

  // ========== 4. SAVE CART (No dependency issues) ==========
  useEffect(() => {
    try {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }, [items, getCartKey]);

  // ========== 5. SWITCH CART WHEN USER CHANGES ==========
  useEffect(() => {
    // This runs only when user changes (login/logout)
    const cartKey = getCartKey();
    
    try {
      const savedCart = localStorage.getItem(cartKey);
      const newCart = savedCart ? JSON.parse(savedCart) : [];
      
      // Only update if cart is different
      if (JSON.stringify(newCart) !== JSON.stringify(items)) {
        setItems(newCart);
        console.log(`Cart loaded for user: ${getCurrentUser()?._id || 'guest'}`);
      }
    } catch (error) {
      console.error('Failed to switch cart on user change:', error);
      setItems([]);
    }
  }, [getCartKey, getCurrentUser]); // Only re-run when user changes

  // ========== 6. CART FUNCTIONS ==========
  const addToCart = useCallback((product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems(prevItems => prevItems.filter(item => item._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    const user = getCurrentUser();
    const cartKey = getCartKey();
    
    // Backup before clearing
    const cartBackup = {
      items: items,
      total: getCartTotal(),
      userId: user?._id || 'guest',
      clearedAt: new Date().toISOString()
    };
    
    localStorage.setItem('cart-last-backup', JSON.stringify(cartBackup));
    
    // Clear cart
    setItems([]);
    localStorage.removeItem(cartKey);
    
    console.log(`Cart cleared for user: ${user?._id || 'guest'}`);
  }, [getCartKey, getCurrentUser, items]);

  // ========== 7. UTILITY FUNCTIONS ==========
  const getCartItemsCount = useCallback(() => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [items]);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price || 0) * (item.quantity || 1));
    }, 0);
  }, [items]);

  const getCartSummary = useCallback(() => {
    const user = getCurrentUser();
    return {
      itemCount: items.length,
      totalItems: getCartItemsCount(),
      totalAmount: getCartTotal(),
      items: items,
      userId: user?._id || 'guest',
      userEmail: user?.email || 'Guest'
    };
  }, [items, getCartItemsCount, getCartTotal, getCurrentUser]);

  // ========== 8. CONTEXT VALUE (Memoized) ==========
  const contextValue = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartSummary,
    getCurrentUser
  }), [
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartSummary,
    getCurrentUser
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};