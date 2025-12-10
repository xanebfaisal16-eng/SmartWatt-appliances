import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { supabase } from '../config/supabase';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  
  // Get items from cart OR from Buy Now (single product)
  const checkoutItems = location.state?.product ? [location.state.product] : items;
  const isBuyNow = location.state?.product;
  
  // SIMPLIFIED FORM - No payment fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',  // ✅ Added phone for COD
    email: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod',  // ✅ Added payment method selection
    deliveryInstructions: ''  // ✅ Added for appliances
  });

  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return checkoutItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const newOrderId = 'ORD-' + Date.now();
    const orderTotal = calculateTotal();
    
    // For appliances, shipping might be calculated differently
    const shipping = orderTotal > 500 ? 0 : 49.99; // Higher threshold for appliances
    const finalTotal = orderTotal + shipping;
    
    // Create order object - OPTIMIZED FOR APPLIANCES
    const order = {
      id: newOrderId,
      items: checkoutItems,
      total: finalTotal,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: `${formData.address}, ${formData.city} - ${formData.zipCode}`,
        deliveryInstructions: formData.deliveryInstructions
      },
      payment: {
        method: formData.paymentMethod,
        status: formData.paymentMethod === 'cod' ? 'Pending' : 'To be Processed'
      },
      date: new Date().toISOString(),
      status: 'Order Received',
      shipping: shipping,
      subtotal: orderTotal,
      type: isBuyNow ? 'Buy Now' : 'Cart Checkout'
    };
    
    try {
      // 1. SAVE TO SUPABASE (Cloud Storage)
      const { data, error } = await supabase
        .from('orders')
        .insert([order]);
      
      if (error) throw error;
      
      // 2. Also save to localStorage as backup
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([order, ...existingOrders]));
      
      // 3. Clear cart if not Buy Now
      if (!isBuyNow) {
        clearCart();
      }
      
      // 4. Optional: Send email notification (simple fetch)
      try {
        await fetch('https://your-backend.onrender.com/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order })
        });
      } catch (emailError) {
        console.log('Email notification failed, order still saved');
      }
      
      // 5. Redirect to confirmation
      navigate(`/order-confirmation/${newOrderId}`, { 
        state: { 
          order,
          savedToCloud: true
        }
      });
      
    } catch (error) {
      console.error('Supabase save failed:', error);
      // Fallback to localStorage only
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([order, ...existingOrders]));
      
      navigate(`/order-confirmation/${newOrderId}`, { 
        state: { 
          order,
          savedToCloud: false 
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkoutItems.length === 0 && !isBuyNow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-lg">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add appliances to your cart before checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-full"
          >
            Browse Appliances
          </button>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const shipping = total > 500 ? 0 : 49.99;
  const finalTotal = total + shipping;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your appliance purchase</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {checkoutItems.map((item, index) => (
                <div key={item._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.images?.[0] || 'https://via.placeholder.com/80'} 
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">Category: {item.category || 'Appliance'}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">
                  Shipping & Installation
                  {shipping === 0 && <span className="ml-2 text-green-600 font-semibold">FREE</span>}
                </span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : "font-semibold"}>
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-300 pt-4">
                <span>Total Amount</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
              
              {/* Important Notes for Appliances */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">📦 Appliance Delivery Information:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Free shipping on orders above ₹500</li>
                  <li>• Delivery within 3-5 business days</li>
                  <li>• Installation available for selected products</li>
                  <li>• Old appliance removal service available</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">Customer Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Full address with landmark"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-800">Cash on Delivery (COD)</span>
                      <p className="text-sm text-gray-600 mt-1">Pay when you receive the appliance</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-800">Bank Transfer</span>
                      <p className="text-sm text-gray-600 mt-1">We'll send account details via email</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-800">UPI Payment</span>
                      <p className="text-sm text-gray-600 mt-1">Pay via UPI after order confirmation</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Additional Instructions */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Delivery Instructions (Optional)</label>
                <textarea
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., Delivery time preference, floor number, installation requirements, etc."
                />
              </div>

              {/* Terms and Submit */}
              <div className="border-t border-gray-200 pt-6">
                <div className="mb-6">
                  <label className="flex items-start">
                    <input type="checkbox" required className="mt-1 mr-3" />
                    <span className="text-sm text-gray-700">
                      I agree to the Terms & Conditions and confirm that I've provided accurate delivery details. 
                      I understand that someone must be available at the delivery address to receive the appliance.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Order...
                    </>
                  ) : (
                    `Place Order - ₹${finalTotal.toFixed(2)}`
                  )}
                </button>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                  You'll receive an order confirmation via SMS and email
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;