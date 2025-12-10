import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { isAuthenticated, logout, getAuthData, isAdmin } from '../utils/auth';

const Header = () => {
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authData = getAuthData();
  const userIsAuthenticated = isAuthenticated();
  const userIsAdmin = isAdmin();
  const userIsSeller = authData.role === 'seller';
  const userIsRegular = userIsAuthenticated && !userIsAdmin && !userIsSeller;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 p-6 shadow-2xl border-b border-yellow-400/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-xl shadow-2xl">
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <circle cx="20" cy="20" r="18" fill="white"/>
              <path 
                d="M20 12 L16 20 L20 17 L14 28 L20 22 L18 32 L26 20 L22 23 L28 12 L20 18 Z" 
                fill="#1e3a8a"
              />
            </svg>
          </div>
          
          <div className="text-left">
            <h1 
              className="font-bold text-4xl md:text-5xl text-white leading-tight italic"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                SmartWatt
              </span>
            </h1>
            <p 
              className="text-gray-300 text-lg font-normal mt-1"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Intelligent Energy Systems
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Energy Efficiency Badge (Always visible) */}
          <div className="hidden md:block">
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-4 py-3 text-center min-w-[140px]">
              <p 
                className="text-yellow-400 text-xs font-semibold uppercase tracking-widest"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                A+ Rated
              </p>
              <p 
                className="text-white text-sm font-bold mt-1"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Energy Efficiency
              </p>
            </div>
          </div>

          {/* User Info & Auth Buttons */}
          <div className="flex items-center gap-4">
            {userIsAuthenticated ? (
              <>
                {/* ADMIN USER */}
                {userIsAdmin && (
                  <>
                    {/* Admin Badge */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-900/40 border border-purple-700/50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs">
                        A
                      </div>
                      <span className="text-purple-300 text-sm font-medium">Admin</span>
                    </div>

                    {/* Dashboard Button */}
                    <Link 
                      to="/dashboard" 
                      className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-all duration-300 border border-gray-700 flex items-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </Link>

                    {/* Logout Button */}
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-all duration-300 border border-gray-700 flex items-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                )}

                {/* SELLER USER */}
                {userIsSeller && (
                  <>
                    {/* Seller Badge */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 border border-blue-700/50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs">
                        S
                      </div>
                      <span className="text-blue-300 text-sm font-medium">Seller</span>
                    </div>

                    {/* Dashboard Button */}
                    <Link 
                      to="/dashboard" 
                      className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-all duration-300 border border-gray-700 flex items-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </Link>

                    {/* Logout Button */}
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-all duration-300 border border-gray-700 flex items-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                )}

                {/* REGULAR USER - Shows ONLY Cart */}
                {userIsRegular && (
                  <>
                    {/* Cart Button (Regular users ONLY see cart) */}
                    <Link 
                      to="/cart" 
                      className="relative px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-all duration-300 border border-gray-300 flex items-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Cart
                      {getCartItemsCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-indigo-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {getCartItemsCount()}
                        </span>
                      )}
                    </Link>
                    
                    {/* Logout Button for Regular Users */}
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-all duration-300 border border-gray-700 flex items-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                )}

                {/* Cart Button for Admin/Seller (they see it too) */}
                {(userIsAdmin || userIsSeller) && (
                  <Link 
                    to="/cart" 
                    className="relative px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-all duration-300 border border-gray-300 flex items-center gap-2 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-indigo-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </Link>
                )}
              </>
            ) : (
              <>
                {/* GUEST USER (Not logged in) - Minimal indicator only */}
                <div className="flex items-center gap-2">
                  {/* Guest Indicator */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <svg className="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm font-medium">Guest</span>
                  </div>
                  
                  {/* Cart Button for Guests */}
                  <Link 
                    to="/cart" 
                    className="relative px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-all duration-300 border border-gray-300 flex items-center gap-2 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-indigo-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden mt-4 flex flex-wrap justify-center items-center gap-3">
        {/* Mobile Energy Badge */}
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-3 py-2 text-center">
          <p className="text-yellow-400 text-xs font-semibold">A+ Rated</p>
          <p className="text-white text-xs font-bold">Energy Efficiency</p>
        </div>

        {userIsAuthenticated ? (
          <>
            {/* ADMIN MOBILE */}
            {userIsAdmin && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/40 border border-purple-700/50 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs">
                    A
                  </div>
                  <span className="text-purple-300 text-sm">Admin</span>
                </div>

                <Link 
                  to="/dashboard" 
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 rounded text-sm font-medium border border-gray-700 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </Link>

                <button 
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 rounded text-sm font-medium border border-gray-700 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}

            {/* SELLER MOBILE */}
            {userIsSeller && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 border border-blue-700/50 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs">
                    S
                  </div>
                  <span className="text-blue-300 text-sm">Seller</span>
                </div>

                <Link 
                  to="/dashboard" 
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 rounded text-sm font-medium border border-gray-700 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </Link>

                <button 
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 rounded text-sm font-medium border border-gray-700 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}

            {/* REGULAR USER MOBILE */}
            {userIsRegular && (
              <>
                <Link 
                  to="/cart" 
                  className="relative px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 rounded text-sm font-medium border border-gray-300 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-300 text-indigo-900 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {getCartItemsCount()}
                    </span>
                  )}
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 rounded text-sm font-medium border border-gray-700 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}

            {/* CART FOR ADMIN/SELLER MOBILE */}
            {(userIsAdmin || userIsSeller) && (
              <Link 
                to="/cart" 
                className="relative px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 rounded text-sm font-medium border border-gray-300 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-300 text-indigo-900 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            )}
          </>
        ) : (
          <>
            {/* GUEST MOBILE (Not logged in) - Minimal indicator only */}
            <div className="flex items-center gap-2">
              {/* Guest Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-white text-sm">Guest</span>
              </div>
              
              {/* Cart Button */}
              <Link 
                to="/cart" 
                className="relative px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 rounded text-sm font-medium border border-gray-300 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-300 text-indigo-900 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Header;