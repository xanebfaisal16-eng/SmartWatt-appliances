// src/services/wishlistService.js - UPDATED FOR YOUR BACKEND
const API_URL = 'http://localhost:8080/api'; // Your backend

export const wishlistService = {
  // Get user's wishlist - FIXED
  async getUserWishlist() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Please login', items: [] };
      }

      const response = await fetch(`${API_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        items: data.wishlist || [],
        count: data.wishlist?.length || 0
      };
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      return {
        success: false,
        error: error.message,
        items: []
      };
    }
  },

  // Add item to wishlist - FIXED
  async addToWishlist(productId) {  // Changed: takes productId not full product
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Please login to save items' };
      }

      // ✅ YOUR BACKEND EXPECTS: /api/wishlist/add/:productId
      const response = await fetch(`${API_URL}/wishlist/add/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add');
      }
      
      return {
        success: true,
        message: data.message || 'Added to wishlist'
      };
    } catch (error) {
      console.error('Add error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Remove item from wishlist - FIXED
  async removeFromWishlist(productId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      // ✅ YOUR BACKEND EXPECTS: /api/wishlist/remove/:productId
      const response = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
        method: 'DELETE',  // Changed from POST to DELETE
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove');
      }
      
      return { 
        success: true, 
        message: data.message || 'Removed from wishlist' 
      };
    } catch (error) {
      console.error('Remove error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Check if item is in wishlist
  async checkInWishlist(productId) {
    try {
      // Since your backend doesn't have a check endpoint,
      // we'll fetch the whole wishlist and check locally
      const result = await this.getUserWishlist();
      if (!result.success) return false;
      
      return result.items.some(item => 
        item._id === productId || 
        item.id === productId || 
        item.productId === productId
      );
    } catch (error) {
      console.error('Check error:', error);
      return false;
    }
  },

  // Clear wishlist (if you add this to backend later)
  async clearWishlist() {
    // Your backend doesn't have this yet
    console.log('Clear wishlist not implemented in backend');
    return { success: false, error: 'Not implemented' };
  }
};