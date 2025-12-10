import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiLock, 
  FiMail, 
  FiUserPlus, 
  FiLogIn, 
  FiShield,
  FiHelpCircle,
  FiAlertCircle
} from 'react-icons/fi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Since we don't have actual password reset logic,
    // we'll show the options after "submitting"
    setShowOptions(true);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  const handleRememberPassword = () => {
    // Simulate remembering password
    alert("Great! Try logging in with your remembered password.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiLock className="text-2xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Password Assistance</h1>
          <p className="text-gray-400">
            Choose your next step carefully
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 shadow-2xl">
          
          {!showOptions ? (
            // Initial Form
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <FiMail className="inline mr-2" />
                  Enter Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                  required
                />
                <p className="text-gray-500 text-sm mt-2">
                  We'll check your account status and show available options
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 mb-4"
              >
                Check Account Status
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleRememberPassword}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  I think I remember my password now
                </button>
              </div>
            </form>
          ) : (
            // Options After Email Check
            <div className="space-y-6">
              {/* Security Notice */}
              <div className="bg-gradient-to-r from-red-900/20 to-red-950/20 border border-red-800/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiShield className="text-red-400 mt-1" />
                  <div>
                    <h3 className="text-red-300 font-medium">Security Protocol Active</h3>
                    <p className="text-red-400/80 text-sm mt-1">
                      Password reset functionality is disabled for enhanced security.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Status Info */}
              <div className="bg-gradient-to-r from-gray-800/20 to-gray-900/20 border border-gray-700/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiHelpCircle className="text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Account Status</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Email: <span className="text-blue-300">{email || 'Not provided'}</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Our system prevents password recovery to eliminate security risks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Available Options */}
              <div className="space-y-4">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <FiAlertCircle /> Available Solutions
                </h3>

                {/* Option 1: Try Login */}
                <div 
                  onClick={goToLogin}
                  className="p-4 bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl cursor-pointer hover:border-gray-600 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <FiLogIn className="text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">Option 1: Try Login Again</h4>
                      <p className="text-gray-400 text-sm">
                        Attempt login with remembered credentials
                      </p>
                    </div>
                    <div className="text-gray-500 group-hover:text-green-400 transition">
                      →
                    </div>
                  </div>
                </div>

                {/* Option 2: Create New Account */}
                <div 
                  onClick={goToSignup}
                  className="p-4 bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl cursor-pointer hover:border-gray-600 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <FiUserPlus className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">Option 2: Create New Account</h4>
                      <p className="text-gray-400 text-sm">
                        Register with a different email address
                      </p>
                    </div>
                    <div className="text-gray-500 group-hover:text-blue-400 transition">
                      →
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="p-4 bg-gradient-to-r from-yellow-900/10 to-yellow-950/10 border border-yellow-800/20 rounded-xl">
                <p className="text-yellow-400 text-sm">
                  ⚠️ <strong>Important:</strong> Save your password securely this time. 
                  We cannot recover lost passwords due to strict security policies.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowOptions(false)}
                  className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition"
                >
                  Back
                </button>
                <button
                  onClick={goToSignup}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-xl transition"
                >
                  Create New Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Links */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-gray-500 text-sm">
            Need assistance?{' '}
            <Link to="/support" className="text-blue-400 hover:text-blue-300">
              Contact Support
            </Link>
          </p>
          <p className="text-gray-600 text-xs">
            For security reasons, password recovery is intentionally disabled.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;