import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { errorToast, warningToast, successToast } from '../function/Toastify';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      errorToast('Please enter both email and password');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      warningToast('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      warningToast('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    
    try {
      // Your API call here
      const response = await fetch('http://localhost:8080/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        successToast('Login successful! Redirecting...');
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard after delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        errorToast(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      errorToast('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      warningToast('Please enter your email first');
      return;
    }
    // Navigate to forgot password page
    navigate('/forgot-password');
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-between px-8 lg:px-20 relative overflow-hidden">
      
      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-2/5 z-20 flex justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Sign In to Your Account
            </h2>
            <p className="text-gray-300">Access your energy dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                disabled={loading}
              />
            </div>

            {/* Password Field with Eye Icon */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-600 bg-white/5 text-yellow-400 focus:ring-yellow-400" 
                />
                <span className="text-gray-300 text-sm">Remember me</span>
              </label>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 font-bold py-4 rounded-xl transform transition-all duration-300 shadow-lg hover:shadow-xl ${
                loading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:from-yellow-300 hover:to-yellow-400 hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-gray-900 rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sign Up Redirect */}
            <div className="text-center pt-4">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={handleSignupRedirect}
                  className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Animated Text */}
      <div className="hidden lg:flex lg:w-3/5 h-full items-center justify-center">
        <div className="text-center">
          {/* UNLOCK THE FEATURES - Bounce Animation */}
          <h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6 animate-bounce"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            UNLOCK THE FEATURES
          </h1>
          
          {/* WITH LOGIN - Static */}
          <h2 
            className="text-3xl md:text-4xl font-bold text-yellow-400 italic"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            WITH LOGIN
          </h2>

          {/* Features List */}
          <div className="mt-8 space-y-3 text-gray-300 text-lg">
            <p> Smart Energy Monitoring</p>
            <p> Real-time Analytics</p>
            <p> AI-Powered Insights</p>
            <p> Eco-Friendly Solutions</p>
          </div>
        </div>
      </div>

      {/* Mobile View - Text at Bottom */}
      <div className="lg:hidden absolute bottom-10 left-0 right-0 text-center">
        <h1 
          className="text-3xl font-bold text-white mb-2 animate-bounce"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          UNLOCK THE FEATURES
        </h1>
        <h2 
          className="text-xl font-bold text-yellow-400 italic"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          WITH LOGIN
        </h2>
      </div>
    </div>
  );
}