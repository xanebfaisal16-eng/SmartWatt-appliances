import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaTruck, 
  FaShieldAlt, FaCreditCard, FaHeadset, FaFacebook, 
  FaInstagram, FaTwitter, FaLinkedin, FaWhatsapp,
  FaStar, FaCheckCircle, FaCalendarAlt, FaTools
} from 'react-icons/fa';
import { MdSupportAgent, MdLocalShipping } from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-400 to-indigo-500"></div>
      
      {/* Trust Badges Section */}
      <div className="bg-gradient-to-r from-blue-900/90 to-indigo-900/90 py-6 border-y border-blue-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-800/30 backdrop-blur-sm border border-blue-700/30">
              <FaShieldAlt className="text-4xl text-green-400 mb-3" />
              <span className="font-bold text-lg">2-Year Warranty</span>
              <span className="text-sm text-blue-200">On all products</span>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-800/30 backdrop-blur-sm border border-blue-700/30">
              <MdLocalShipping className="text-4xl text-green-400 mb-3" />
              <span className="font-bold text-lg">Free Shipping</span>
              <span className="text-sm text-blue-200">Over $299 orders</span>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-800/30 backdrop-blur-sm border border-blue-700/30">
              <FaCheckCircle className="text-4xl text-green-400 mb-3" />
              <span className="font-bold text-lg">Certified Products</span>
              <span className="text-sm text-blue-200">100% genuine brands</span>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-800/30 backdrop-blur-sm border border-blue-700/30">
              <MdSupportAgent className="text-4xl text-green-400 mb-3" />
              <span className="font-bold text-lg">24/7 Support</span>
              <span className="text-sm text-blue-200">Expert assistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-gradient-to-b from-gray-900/95 to-gray-900 py-12 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  Appliance<span className="text-white">Pro</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Premium home appliances with professional installation. 
                Serving customers with excellence since 2010. 
                Your comfort is our priority.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center text-white hover:bg-blue-700 hover:scale-110 transition-all duration-300 border border-blue-700">
                  <FaFacebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white hover:scale-110 transition-all duration-300">
                  <FaInstagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300">
                  <FaTwitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 hover:scale-110 transition-all duration-300">
                  <FaLinkedin size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links - FIXED WITH UNIQUE KEYS */}
            <div>
              <h4 className="text-xl font-bold mb-6 pb-3 border-b border-blue-700/50 text-white">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { id: 1, path: "/", label: "Home" },
                  { id: 2, path: "/Products", label: "Shop All Products" },
                  { id: 3, path: "/Products?category=new", label: "New Arrivals" },
                  { id: 4, path: "/Products?category=best", label: "Best Sellers" },
                  { id: 5, path: "/Delivery", label: "Delivery Information" },
                  { id: 6, path: "/ContactUs", label: "Book Installation" },
                ].map((link) => (
                  <li key={link.id}> {/* Changed from key={link.path} to key={link.id} */}
                    <Link 
                      to={link.path}
                      className="text-gray-300 hover:text-green-400 transition-all duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xl font-bold mb-6 pb-3 border-b border-blue-700/50 text-white">
                Top Categories
              </h4>
              <ul className="space-y-3">
                {[
                  "Smart Refrigerators",
                  "Front Load Washers",
                  "Inverter AC Units",
                  "Built-in Ovens",
                  "Dishwashers",
                  "Microwaves",
                  "Small Appliances",
                  "Smart Home Devices"
                ].map((category, index) => ( // Added index parameter
                  <li key={`category-${index}`}> {/* Added unique key with index */}
                    <Link 
                      to="/Products"
                      className="text-gray-300 hover:text-blue-400 transition-all duration-300 flex items-center group"
                    >
                      <FaStar className="text-yellow-500 text-xs mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h4 className="text-xl font-bold mb-6 pb-3 border-b border-blue-700/50 text-white">
                Stay Connected
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-900/30 border border-blue-700/30">
                  <FaHeadset className="text-green-400 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Need Help?</p>
                    <p className="text-gray-300 text-sm">Our experts are ready to assist you</p>
                    <a href="tel:+18005551234" className="text-green-400 font-bold hover:underline">
                      1-800-555-1234
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-4 rounded-lg border border-blue-700/30">
                  <h5 className="font-bold mb-3 text-white">Newsletter</h5>
                  <p className="text-sm text-gray-300 mb-3">Get exclusive deals and appliance tips</p>
                  <div className="flex">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="flex-grow px-4 py-2 rounded-l-lg bg-gray-800 border border-blue-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    />
                    <button className="bg-gradient-to-r from-green-500 to-blue-500 px-4 py-2 rounded-r-lg font-semibold hover:opacity-90 transition-opacity">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 rounded-lg bg-blue-900/20 border border-blue-700/30">
              <FaCalendarAlt className="text-2xl text-green-400 mx-auto mb-2" />
              <h5 className="font-bold mb-1">Store Hours</h5>
              <p className="text-sm text-gray-300">Mon-Sat: 9AM-9PM</p>
              <p className="text-sm text-gray-300">Sunday: 10AM-6PM</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-blue-900/20 border border-blue-700/30">
              <FaTools className="text-2xl text-green-400 mx-auto mb-2" />
              <h5 className="font-bold mb-1">Service Hours</h5>
              <p className="text-sm text-gray-300">Installation: 8AM-8PM</p>
              <p className="text-sm text-gray-300">Emergency: 24/7</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-blue-900/20 border border-blue-700/30">
              <FaWhatsapp className="text-2xl text-green-400 mx-auto mb-2" />
              <h5 className="font-bold mb-1">WhatsApp Support</h5>
              <p className="text-sm text-gray-300">Quick responses</p>
              <a href="#" className="text-green-400 text-sm hover:underline">+1 (555) 123-4567</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-950 py-6 border-t border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} <span className="text-white font-semibold">AppliancePro</span>. All rights reserved. 
                <span className="text-green-400 ml-2">Premium Home Appliances</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ISO 9001:2015 Certified • Authorized Retailer
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/terms" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/warranty" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Warranty Terms
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/returns" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Return Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/sitemap" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Sitemap
              </Link>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="mt-6 pt-6 border-t border-gray-800/50">
            <div className="flex flex-col items-center">
              <p className="text-gray-400 text-sm mb-3">We Accept</p>
              <div className="flex space-x-4">
                {['Visa', 'MasterCard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map((method, index) => (
                  <div key={`payment-${index}`} className="px-3 py-1 bg-gray-800/50 rounded text-xs text-gray-300 border border-gray-700">
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-green-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 border border-blue-400"
        aria-label="Back to top"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;