// screens/Payments.jsx
import React, { useState } from 'react';
import { FiCreditCard, FiPlus, FiTrash2, FiCheck, FiDollarSign, FiPackage, FiMessageSquare, FiPhone } from 'react-icons/fi';

const Payments = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { 
      id: 1, 
      type: 'cod', 
      name: 'Cash on Delivery',
      description: 'Pay when you receive the appliance',
      icon: '💰',
      isDefault: true 
    },
    { 
      id: 2, 
      type: 'upi', 
      name: 'UPI Payment',
      description: 'Google Pay, PhonePe, Paytm',
      upiId: 'smartwatt@upi',
      icon: '📱',
      isDefault: false 
    },
    { 
      id: 3, 
      type: 'bank', 
      name: 'Bank Transfer',
      description: 'NEFT/RTGS/IMPS',
      account: 'Account details will be shared',
      icon: '🏦',
      isDefault: false 
    },
  ]);

  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [showInstructions, setShowInstructions] = useState(false);

  const setAsDefault = (id) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    const selected = paymentMethods.find(m => m.id === id);
    setSelectedMethod(selected.type);
  };

  const removeMethod = (id) => {
    if (paymentMethods.length > 1) {
      setPaymentMethods(methods => methods.filter(method => method.id !== id));
    } else {
      alert('You must have at least one payment method');
    }
  };

  const getPaymentInstructions = (type) => {
    switch(type) {
      case 'cod':
        return {
          title: 'Cash on Delivery Instructions',
          steps: [
            'Pay when appliance is delivered',
            'Exact cash or UPI at delivery',
            'Get ₹100 discount for UPI payment',
            'Installation included in price'
          ],
          contact: 'Our delivery executive will collect payment'
        };
      case 'upi':
        return {
          title: 'UPI Payment Instructions',
          steps: [
            'Scan QR code or send to UPI ID',
            'UPI ID: smartwatt@appliances',
            'Include Order ID in payment note',
            'Send payment screenshot to WhatsApp'
          ],
          contact: 'WhatsApp payment confirmation: +91 9876543210'
        };
      case 'bank':
        return {
          title: 'Bank Transfer Details',
          steps: [
            'Bank: State Bank of India',
            'Account: SmartWatt Appliances',
            'IFSC: SBIN0001234',
            'Send transaction screenshot after payment'
          ],
          contact: 'Email bank details to: accounts@smartwatt.com'
        };
      default:
        return { title: '', steps: [], contact: '' };
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-white">Payment Options</h1>
        <p className="text-gray-300">Choose how you want to pay for your appliances</p>
      </div>

      {/* Important Notice */}
      <div className="mb-8 p-4 bg-blue-900/30 border border-blue-700/50 rounded-xl">
        <div className="flex items-start gap-3">
          <FiPackage className="text-blue-400 mt-1" />
          <div>
            <h3 className="font-bold text-blue-300 mb-1">Appliance Purchase Note</h3>
            <p className="text-gray-300 text-sm">
              For large appliance purchases, we recommend Cash on Delivery or Bank Transfer for better transaction security. 
              Installation and delivery charges are included in the final price.
            </p>
          </div>
        </div>
      </div>

      {/* Current Default Method */}
      <div className="mb-8 p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-yellow-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Currently Selected</h3>
            <p className="text-gray-300 text-sm">This will be used for your next purchase</p>
          </div>
          <div className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium">
            Selected
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
          <div className="text-3xl">
            {paymentMethods.find(m => m.isDefault)?.icon || '💰'}
          </div>
          <div>
            <h4 className="font-bold text-white">{paymentMethods.find(m => m.isDefault)?.name}</h4>
            <p className="text-gray-400 text-sm">{paymentMethods.find(m => m.isDefault)?.description}</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center gap-2"
        >
          <FiMessageSquare />
          {showInstructions ? 'Hide Instructions' : 'View Payment Instructions'}
        </button>
      </div>

      {/* Payment Instructions */}
      {showInstructions && (
        <div className="mb-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-4">
            {getPaymentInstructions(selectedMethod).title}
          </h3>
          <div className="space-y-3 mb-6">
            {getPaymentInstructions(selectedMethod).steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-sm mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-300">{step}</p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <div className="flex items-center gap-3">
              <FiPhone className="text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Need help with payment?</p>
                <p className="text-white font-medium">{getPaymentInstructions(selectedMethod).contact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map(method => (
          <div 
            key={method.id} 
            className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 ${
              method.isDefault 
                ? 'border-yellow-500/50 bg-yellow-500/5' 
                : 'border-gray-700/50 hover:border-gray-600/50'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  method.isDefault 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500' 
                    : 'bg-gradient-to-r from-gray-700 to-gray-800'
                }`}>
                  {method.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white">{method.name}</h3>
                  <p className="text-gray-400 text-sm">{method.description}</p>
                </div>
              </div>
              {method.isDefault && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  <FiCheck className="inline mr-1" />
                  Default
                </span>
              )}
            </div>

            {method.upiId && (
              <p className="text-gray-300 mb-4">ID: <span className="text-white font-medium">{method.upiId}</span></p>
            )}

            {method.account && (
              <p className="text-gray-300 mb-4">{method.account}</p>
            )}

            <div className="flex gap-3 mt-4">
              {!method.isDefault && (
                <button
                  onClick={() => setAsDefault(method.id)}
                  className="flex-1 py-2.5 border border-gray-600 hover:bg-gray-700 rounded-lg font-medium transition text-white"
                >
                  Select Method
                </button>
              )}
              {paymentMethods.length > 1 && (
                <button
                  onClick={() => removeMethod(method.id)}
                  className="px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition"
                >
                  <FiTrash2 className="inline mr-2" />
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Payment Method Options */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-white mb-6">Add Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => alert('UPI ID will be shared after order confirmation')}
            className="p-6 bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 rounded-2xl text-center transition group"
          >
            <div className="text-3xl mb-3">📱</div>
            <h4 className="font-bold text-white mb-2">Add UPI ID</h4>
            <p className="text-gray-400 text-sm">Google Pay, PhonePe, etc.</p>
          </button>
          
          <button
            onClick={() => alert('Bank account details will be emailed after order confirmation')}
            className="p-6 bg-gray-800/50 border border-gray-700/50 hover:border-green-500/50 rounded-2xl text-center transition group"
          >
            <div className="text-3xl mb-3">🏦</div>
            <h4 className="font-bold text-white mb-2">Add Bank Account</h4>
            <p className="text-gray-400 text-sm">For direct transfers</p>
          </button>
          
          <button
            onClick={() => alert('Contact sales for credit options')}
            className="p-6 bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 rounded-2xl text-center transition group"
          >
            <div className="text-3xl mb-3">💳</div>
            <h4 className="font-bold text-white mb-2">Credit Options</h4>
            <p className="text-gray-400 text-sm">EMI & financing available</p>
          </button>
        </div>
      </div>

      {/* Important Information */}
      <div className="mt-12 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Important Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="text-green-400 mt-1">✓</div>
            <div>
              <p className="text-white font-medium">Secure Payments</p>
              <p className="text-gray-400 text-sm">All transactions are secure and encrypted</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-green-400 mt-1">✓</div>
            <div>
              <p className="text-white font-medium">No Extra Charges</p>
              <p className="text-gray-400 text-sm">No hidden fees on any payment method</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-green-400 mt-1">✓</div>
            <div>
              <p className="text-white font-medium">Payment Confirmation</p>
              <p className="text-gray-400 text-sm">Get instant SMS/email on successful payment</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-green-400 mt-1">✓</div>
            <div>
              <p className="text-white font-medium">24/7 Support</p>
              <p className="text-gray-400 text-sm">Payment assistance available anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;