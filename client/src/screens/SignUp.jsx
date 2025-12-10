import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, warningToast, successToast } from '../function/Toastify';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [robotVisible, setRobotVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRobotVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation with toast messages
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      errorToast('Please fill in all fields');
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

    // Check for password strength
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      warningToast('Password must contain uppercase, lowercase, number, and special character');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      errorToast('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // API call for signup
      const response = await fetch('http://localhost:8080/api/v1/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: formData.name.split(' ')[0] || formData.name,
          last_name: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          password: formData.password,
          username: formData.email.split('@')[0] || `user_${Date.now()}`
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        successToast(data.message || 'Account created successfully!');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        errorToast(data.message || data.error || data.warning || 'Signup failed. Please try again.');
      }
    } catch (error) {
      errorToast('Network error. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:8080/api/v1/auth/google';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-between px-4 lg:px-12 xl:px-20 relative overflow-hidden'>
      
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

      {/* Left Side - Form Section */}
      <div className="w-full lg:w-2/5 z-20 flex justify-center">
        <div className="bg-[#171717]/95 backdrop-blur-lg rounded-3xl p-6 lg:p-8 max-w-md w-full border border-white/20 shadow-2xl">
          
          <div className="text-center mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Join <span className="text-yellow-400">SmartWatt</span>
            </h1>
            <p className="text-gray-400 text-sm lg:text-base">Create your account and start saving energy</p>
          </div>

          {/* Continue with Google Button */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Continue with Google</span>
            </button>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#171717] text-gray-400">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            
            <div className="flex items-center gap-3 rounded-2xl p-3 bg-[#171717] border border-gray-700 shadow-[inset_2px_5px_10px_rgb(5,5,5)] hover:border-yellow-400/50 transition-colors">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
              </svg>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text" 
                placeholder="Full Name" 
                className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 focus:text-white transition-colors text-sm lg:text-base"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3 rounded-2xl p-3 bg-[#171717] border border-gray-700 shadow-[inset_2px_5px_10px_rgb(5,5,5)] hover:border-yellow-400/50 transition-colors">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2Zm3.295 2.995a.75.75 0 0 1 .91-.004l2.79 2.103 2.8-2.104a.75.75 0 1 1 .902 1.205l-3.25 2.445a.75.75 0 0 1-.902 0L5.397 6.196a.75.75 0 0 1-.102-1.201Z"/>
              </svg>
              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email" 
                placeholder="Email Address" 
                className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 focus:text-white transition-colors text-sm lg:text-base"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field with Eye Icon */}
            <div className="flex items-center gap-3 rounded-2xl p-3 bg-[#171717] border border-gray-700 shadow-[inset_2px_5px_10px_rgb(5,5,5)] hover:border-yellow-400/50 transition-colors">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              <input 
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 8 chars)" 
                className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 focus:text-white transition-colors text-sm lg:text-base"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none"
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password Field with Eye Icon */}
            <div className="flex items-center gap-3 rounded-2xl p-3 bg-[#171717] border border-gray-700 shadow-[inset_2px_5px_10px_rgb(5,5,5)] hover:border-yellow-400/50 transition-colors">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              <input 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password" 
                className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 focus:text-white transition-colors text-sm lg:text-base"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 p-3">
              <input 
                type="checkbox" 
                id="terms"
                className="rounded border-gray-600 bg-gray-800 text-yellow-400 focus:ring-yellow-400 focus:ring-2 w-4 h-4"
                required
                disabled={loading}
              />
              <label htmlFor="terms" className="text-gray-400 text-xs lg:text-sm">
                I agree to the <span className="text-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors">Terms & Conditions</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Link to="/" className="flex-1">
                <button 
                  type="button" 
                  disabled={loading}
                  className="w-full py-2 lg:py-3 px-4 rounded-xl bg-gray-800/80 text-gray-300 hover:bg-gray-900 hover:text-white transition-all duration-300 font-medium border border-gray-700 hover:border-gray-600 text-sm lg:text-base disabled:opacity-50"
                >
                  Cancel
                </button>
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className={`flex-1 py-2 lg:py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 font-bold shadow-lg transition-all duration-300 text-sm lg:text-base ${
                  loading 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 hover:shadow-yellow-400/25'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-t-2 border-gray-900 rounded-full animate-spin mr-2"></div>
                    Signing Up...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-400 text-xs lg:text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* === Right Side - Robot Section WITH Animation === */}
      <div className="hidden lg:flex lg:w-3/5 h-full items-center justify-center relative">
  <div
    className={`relative w-full h-[500px] max-w-2xl flex items-center justify-center transition-all duration-700 ${
      robotVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`}
  >
    {/* 3D Robot */}
    <iframe
      loading="fast"
      src="https://my.spline.design/nexbotrobotcharacterconcept-00szPMmCpig8p9H9kmRAck22/"
      frameBorder="0"
      className="w-full h-full scale-125"
      title="3D Robot Animation"
      style={{ filter: 'brightness(1.1)' }}
    />

    {/* Robot Thought Cloud - RIGHT SIDE TOP */}
        

    {/* Watermark cover box */}
    <div className="absolute bottom-[-38px] right-[-78px] w-72 h-24 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-tl-2xl p-4 shadow-2xl border-2 border-white z-20">
      <div className="flex items-center justify-between h-full">
        <div className="mb-2">
          <h3 className="text-gray-900 font-bold text-sm italic">SmartWatt AI Activated! 🚀</h3>
          <p className="text-gray-700 text-xs italic mt-1">
            AI-powered energy optimization & real-time insights
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Mobile Robot */}
      <div className="lg:hidden absolute bottom-6 right-6 text-6xl opacity-20 z-10">
        🤖
      </div>
    </div>
  );
};

export default SignUp