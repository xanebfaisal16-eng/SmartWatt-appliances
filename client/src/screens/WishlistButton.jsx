// src/components/WishlistButton.jsx
import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { wishlistService } from '../services/wishlistService';

const WishlistButton = ({ productId, product, size = 'md', showText = false }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hover, setHover] = useState(false);

  // Get productId from product object if provided
  const actualProductId = productId || product?.id || product?._id;

  // Check wishlist status on mount
  useEffect(() => {
    if (actualProductId) {
      checkWishlistStatus();
    }
  }, [actualProductId]);

  const checkWishlistStatus = async () => {
    if (!actualProductId) return;
    
    try {
      const inWishlist = await wishlistService.checkInWishlist(actualProductId);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Check wishlist error:', error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading || !actualProductId) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to save items');
      setTimeout(() => setMessage(''), 3000);
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const result = await wishlistService.removeFromWishlist(actualProductId);
        if (result.success) {
          setIsInWishlist(false);
          setMessage('Removed from wishlist');
          // Trigger custom event for other components
          window.dispatchEvent(new CustomEvent('wishlist-updated'));
        } else {
          setMessage(result.error || 'Failed to remove');
        }
      } else {
        // Add to wishlist
        const result = await wishlistService.addToWishlist(actualProductId);
        if (result.success) {
          setIsInWishlist(true);
          setMessage('Added to wishlist!');
          // Trigger custom event for other components
          window.dispatchEvent(new CustomEvent('wishlist-updated'));
        } else {
          setMessage(result.error || 'Failed to add');
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      setMessage('Something went wrong');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const buttonSize = sizes[size] || sizes.md;

  return (
    <div className="relative inline-block">
      <button
        onClick={handleWishlistToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        disabled={loading || !actualProductId}
        className={`
          ${buttonSize}
          rounded-lg transition-all duration-300 flex items-center gap-2
          ${isInWishlist 
            ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-500 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/30' 
            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/60 hover:text-red-400 border border-gray-700/50'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${showText ? 'min-w-[140px] justify-center' : ''}
          shadow-md hover:shadow-lg
        `}
        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
            {showText && <span className="ml-2">Processing...</span>}
          </>
        ) : (
          <>
            {isInWishlist ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className={hover ? 'text-red-400' : 'text-gray-400'} />
            )}
            {showText && (
              <span className="ml-2 font-medium">
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </span>
            )}
          </>
        )}
      </button>
      
      {/* Message Toast */}
      {message && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50 animate-fade-in">
          {message}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Optional: Add this CSS for animation
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translate(-50%, 10px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default WishlistButton;