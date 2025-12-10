import React, { useState } from 'react';
import { TbShoppingCart, TbEye, TbStar, TbStarFilled, TbLogin } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';
import sample from '../images/noProductFound.png';
import { toast } from 'react-toastify';

const ProductsCard = ({ product }) => {
  const { _id, title, images, stock, brand, description, price, category, rating, ratingCount } = product;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  // Handle Buy Now button click
  const handleBuyNowClick = (e) => {
    e.preventDefault();
    
    // Check stock
    if (stock < 1) {
      toast.error('This product is out of stock');
      return;
    }
    
    // Check authentication
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    
    // If authenticated, proceed to product page
    navigate(`/product/${_id}`);
  };

  // Handle Add to Cart click
  const handleAddToCartClick = (e) => {
    e.preventDefault();
    
    // Check stock
    if (stock < 1) {
      toast.error('This product is out of stock');
      return;
    }
    
    // Check authentication
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    
    // If authenticated, add to cart logic here
    console.log('Adding to cart:', _id);
    toast.success(`${title} added to cart!`);
  };

  // Star Rating Component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span key={index} className="text-yellow-400">
              {starValue <= Math.floor(rating) ? (
                <TbStarFilled className="w-3.5 h-3.5 fill-current" />
              ) : starValue === Math.ceil(rating) && rating % 1 !== 0 ? (
                <div className="relative">
                  <TbStar className="w-3.5 h-3.5 text-yellow-300" />
                  <div 
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{ width: `${(rating % 1) * 100}%` }}
                  >
                    <TbStarFilled className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              ) : (
                <TbStar className="w-3.5 h-3.5 text-gray-300" />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // Login Modal Component
  const LoginModal = () => {
    if (!showLoginModal) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 animate-fadeIn"
        onClick={() => setShowLoginModal(false)}
      >
        <div 
          className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200 shadow-2xl animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <TbLogin className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign In to Shop</h3>
            <p className="text-gray-600">Create an account or login to purchase items</p>
          </div>
          
          <div className="space-y-3 mb-6">
            <Link 
              to="/login" 
              className="block w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl text-white font-semibold text-center transition flex items-center justify-center gap-2"
              onClick={() => setShowLoginModal(false)}
            >
              <TbLogin className="w-5 h-5" />
              Login to Existing Account
            </Link>
            
            <Link 
              to="/signup" 
              className="block w-full py-3.5 bg-gradient-to-r from-indigo-700 to-purple-600 hover:from-indigo-800 hover:to-purple-700 rounded-xl text-white font-semibold text-center transition flex items-center justify-center gap-2"
              onClick={() => setShowLoginModal(false)}
            >
              Create New Account
            </Link>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-gray-500 hover:text-gray-700 text-sm transition px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='bg-white rounded-2xl overflow-hidden p-5 shadow-lg hover:shadow-2xl mt-8 transform hover:scale-[1.02] transition-all duration-500 border border-gray-100 hover:border-blue-200/50 group/card'>

        {/* Image Section */}
        <div className='relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100'>
          <Link to={`/product/${_id}`} className="block">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
            )}
            <img
              className={`w-full h-56 object-contain p-4 cursor-pointer transition-all duration-700 group-hover/card:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              src={images?.[0] ? images[0] : sample}
              alt={title}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = sample;
                setImageLoaded(true);
              }}
            />
          </Link>
          
          {/* Top Badges */}
          <div className='absolute top-3 left-3 right-3 flex justify-between items-start'>
            {/* Stock Badge */}
            <span 
              className={`font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wide shadow-lg ${
                stock < 1 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              }`}
            >
              {stock < 1 ? 'Out of Stock' : 'In Stock'}
            </span>

            {/* Brand Badge */}
            {brand && (
              <span className='bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg'>
                {brand}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className='pt-5'>
          {/* Category */}
          {category && (
            <span className='text-xs text-gray-500 uppercase tracking-wide font-semibold bg-gray-100 px-3 py-1.5 rounded-full'>
              {category}
            </span>
          )}

          {/* Title */}
          <Link to={`/product/${_id}`} className="group/title">
            <h1 className='text-lg font-bold text-gray-900 mt-3 cursor-pointer line-clamp-2 leading-tight group-hover/title:text-blue-600 transition-colors duration-300'>
              {title}
            </h1>
          </Link>

          {/* Description */}
          <p className='text-gray-600 text-sm mt-3 line-clamp-2 leading-relaxed'>
            {description || "No description available"}
          </p>

          {/* Rating & Price Row */}
          <div className='flex items-center justify-between mt-5'>
            {/* Rating */}
            <div className='flex items-center gap-2'>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={rating || 0} />
                  <span className="text-sm font-bold text-gray-900">
                    {rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                {ratingCount > 0 && (
                  <span className="text-xs text-gray-500 mt-0.5">
                    ({ratingCount} review{ratingCount !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className='text-right'>
              <span className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                ${price?.toFixed(2) || '0.00'}
              </span>
              {stock > 0 && (
                <div className='text-xs text-green-600 font-semibold flex items-center gap-1 mt-0.5'>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Free Shipping
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            {/* View Details Button */}
            <Link to={`/product/${_id}`} className="flex-1">
              <button 
                className={`w-full flex items-center justify-center gap-2 font-semibold rounded-xl py-3 transition-all duration-300 ${
                  stock < 1 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-95 shadow-md'
                }`}
              >
                <TbEye className="w-5 h-5" />
                View Details
              </button>
            </Link>
            
            {/* Buy Now Button with Guest User Handling */}
            {stock > 0 ? (
              <div className="relative group/buy">
                <button
                  onClick={handleBuyNowClick}
                  className={`w-full h-full flex items-center justify-center gap-2 font-semibold rounded-xl py-3 transition-all duration-300 px-4 ${
                    isAuthenticated()
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-95 shadow-md'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-95 shadow-md'
                  }`}
                >
                  <TbShoppingCart className="w-5 h-5" />
                  {isAuthenticated() ? 'Buy Now' : 'Login to Buy'}
                </button>
                
                {/* Hover tooltip for guest users */}
                {!isAuthenticated() && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/buy:block">
                    <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-2xl whitespace-nowrap">
                      <p className="font-medium mb-1">Sign in to purchase</p>
                      <div className="flex gap-2">
                        <Link 
                          to="/login" 
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition"
                        >
                          Login
                        </Link>
                        <Link 
                          to="/signup" 
                          className="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 rounded text-xs font-medium transition"
                        >
                          Sign Up
                        </Link>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                disabled
                className="px-4 bg-gray-100 text-gray-500 rounded-xl py-3 font-semibold cursor-not-allowed"
              >
                <TbShoppingCart className="w-5 h-5 inline mr-2" />
                Out of Stock
              </button>
            )}
          </div>

          {/* Guest User Prompt */}
          {!isAuthenticated() && stock > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Ready to purchase?</p>
                  <p className="text-xs text-gray-500">Create an account to checkout</p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    to="/login" 
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition border border-blue-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-medium transition border border-indigo-200"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">{stock || 0}</span> in stock
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Category:</span> {category || 'General'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal />
    </>
  );
};

// Add these styles to your main CSS
const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.4s ease-out;
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ProductsCard;