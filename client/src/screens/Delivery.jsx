import React from "react";

const Delivery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Delivery <span className="text-yellow-400">Information</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Fast, reliable delivery with complete transparency and tracking
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          
          {/* Shipping Options */}
          <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Shipping Options</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { type: "Standard", time: "3-5 business days", price: "Free over $50", color: "bg-green-500" },
                { type: "Express", time: "1-2 business days", price: "$9.99", color: "bg-blue-500" },
                { type: "Same Day", time: "Within 24 hours", price: "$19.99", color: "bg-purple-500" }
              ].map((option, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all">
                  <div className={`w-8 h-8 ${option.color} rounded-full flex items-center justify-center mb-2`}>
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg">{option.type}</h3>
                  <p className="text-gray-300 text-sm mt-1">{option.time}</p>
                  <p className="text-yellow-400 font-bold mt-2">{option.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Charges */}
          <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Delivery Charges</h2>
            </div>
            <div className="space-y-3">
              {[
                { text: "Free delivery for orders above $50", icon: "🎁" },
                { text: "Flat $5 charge for orders below $50", icon: "📦" },
                { text: "Express delivery charges apply separately", icon: "⚡" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Tracking */}
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Order Tracking</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Once your order is shipped, you'll receive a tracking link via email and SMS. 
              Follow your delivery in real-time with live updates and estimated arrival times.
            </p>
            <div className="mt-4 flex items-center gap-2 text-yellow-400">
              <span>🔔</span>
              <span className="text-sm">Real-time notifications and delivery alerts</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="text-white font-semibold">Safe Delivery</h3>
              <p className="text-gray-300 text-sm">Contactless delivery options available</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl mb-2">⏰</div>
              <h3 className="text-white font-semibold">On Time</h3>
              <p className="text-gray-300 text-sm">97% on-time delivery rate</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl mb-2">📞</div>
              <h3 className="text-white font-semibold">Support</h3>
              <p className="text-gray-300 text-sm">24/7 customer support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;