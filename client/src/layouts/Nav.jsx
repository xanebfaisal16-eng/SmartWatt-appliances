import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Nav = () => {
  const [hoveredLink, setHoveredLink] = useState(null)
  const location = useLocation()

  // Check if current page is Home
  const isHomePage = location.pathname === '/'

  // SVG Icons
  const HomeIcon = ({ isActive, isHovered }) => (
    <svg className={`w-5 h-5 transition-all duration-300 ${isHovered ? 'scale-110' : ''} ${isActive ? 'scale-110' : ''}`} 
         fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
    </svg>
  )

  const ProductsIcon = ({ isActive, isHovered }) => (
    <svg className={`w-5 h-5 transition-all duration-300 ${isHovered ? 'scale-110' : ''} ${isActive ? 'scale-110' : ''}`} 
         fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
    </svg>
  )

  const ContactIcon = ({ isActive, isHovered }) => (
    <svg className={`w-5 h-5 transition-all duration-300 ${isHovered ? 'scale-110' : ''} ${isActive ? 'scale-110' : ''}`} 
         fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
    </svg>
  )

  const SignUpIcon = ({ isActive, isHovered }) => (
    <svg className={`w-5 h-5 transition-all duration-300 ${isHovered ? 'scale-110' : ''} ${isActive ? 'scale-110' : ''}`} 
         fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
    </svg>
  )

  const DeliveryIcon = ({ isActive, isHovered }) => (
    <svg className={`w-5 h-5 transition-all duration-300 ${isHovered ? 'scale-110' : ''} ${isActive ? 'scale-110' : ''}`} 
         fill="currentColor" viewBox="0 0 20 20">
      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
    </svg>
  )

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/ContactUs', label: 'Contact', icon: ContactIcon },
    { path: '/SignUp', label: 'Sign Up', icon: SignUpIcon },
    { path: '/Delivery', label: 'Delivery', icon: DeliveryIcon }
  ]

  return (
    <div className={`bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 p-4 shadow-2xl border-b border-yellow-400/20 ${
      isHomePage ? 'sticky top-0 z-50' : 'relative'
    }`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      
      <nav className="relative z-10 flex justify-center items-center gap-4 flex-wrap">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const isHovered = hoveredLink === item.path
          const IconComponent = item.icon
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative group font-bold text-lg px-6 py-3 rounded-2xl transition-all duration-500 
                         ${isActive 
                           ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 shadow-2xl shadow-yellow-400/50 scale-105' 
                           : 'text-white hover:text-yellow-300 bg-white/5 backdrop-blur-sm border border-white/10'
                         }`}
              onMouseEnter={() => setHoveredLink(item.path)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 rounded-2xl blur-xl transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`} />
              
              {/* Content */}
              <span className="relative z-10 flex items-center gap-3">
                <IconComponent isActive={isActive} isHovered={isHovered} />
                <span className="whitespace-nowrap">{item.label}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse" />
                )}
              </span>

              {/* Hover Animation Line */}
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-yellow-400 rounded-full transition-all duration-500 ${
                isHovered ? 'w-3/4' : 'w-0'
              }`} />
            </Link>
          )
        })}
      </nav>

      {/* Brand Badge */}
      <div className="relative z-10 mt-4 text-center">
        <div className="text-yellow-300 text-sm font-semibold bg-yellow-400/10 rounded-full px-4 py-2 inline-block border border-yellow-400/20 backdrop-blur-sm">
          ⚡ Powering Your Future
        </div>
      </div>
    </div>
  )
}

export default Nav