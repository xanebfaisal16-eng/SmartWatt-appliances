import React, { useEffect } from 'react';
import Header from './layouts/Header'
import Nav from './layouts/Nav'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { CartProvider } from './context/cartContext'
import Home from './screens/Home'
import ContactUs from './screens/Contactus'
import Products from './screens/Products'
import SignUp from './screens/SignUp'
import Login from './screens/Login'
import ForgotPassword from './screens/ForgotPassword'
import Delivery from './screens/Delivery'
import SingleProduct from './screens/SingleProduct'
import Cart from './screens/Cart'
import ChatBox from './screens/Chatbox' 
import AdminMessages from './screens/Adminmsgs'
import Checkout from './layouts/CheckOut'
import AdminOrders from './screens/AdminOrders'
import OrderConfirmation from './screens/OrdersConfirmation'
import Dashboard from './screens/Dashbord'
import Support from './screens/Support'
import { ToastContainer } from 'react-toastify'
import Footer from './layouts/Footer'
import AdminSupport from './screens/AdminSupport'
import ProtectedRoute from './screens/ProtectedRoute'
import { saveAuthFromURL } from './utils/auth'
import EditProductPage from './screens/EditProductPage'

// ==================== THEME SYSTEM ====================
const ThemeContext = React.createContext();

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('smartwatt-theme');
    return saved === 'dark' || 
      (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  React.useEffect(() => {
    localStorage.setItem('smartwatt-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
// ==================== END THEME SYSTEM ====================

const AppContent = () => {
  const location = useLocation();
  
  useEffect(() => {
    const authData = saveAuthFromURL();
    if (authData) {
      console.log('User logged in via Google:', authData);
      if (window.toast) {
        window.toast.success(`Welcome ${authData.role === 'admin' ? 'Admin' : 'User'}!`);
      }
    }
  }, [location]);
  
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isCheckout = location.pathname === '/checkout';
  const isOrderConfirmation = location.pathname.startsWith('/order-confirmation');
  const isAdminPath = location.pathname.startsWith('/admin');
  const isLogin = location.pathname === '/login';
  const isSignup = location.pathname === '/signup';

  const hideFooter = isDashboard || isCheckout || isOrderConfirmation || isAdminPath;
  const hideHeaderNav = isLogin || isSignup;

  return (
    // FINAL: Light mode = white/light, Dark mode = your original colors
    <div className='min-h-screen flex flex-col bg-white dark:bg-gradient-to-br dark:from-indigo-900 dark:via-blue-900 dark:to-gray-900 text-gray-900 dark:text-white'>
      {!isDashboard && !hideHeaderNav && (
        <>
          <div className="p-8 pb-0">
            <Header />
          </div>
          <div className="px-8">
            <Nav />
          </div>
          <ToastContainer/>
        </>
      )}

      {(isLogin || isSignup) && <ToastContainer />}
      
      <main className={`flex-grow ${isDashboard ? '' : 'p-8 pt-4'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />  
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/delivery" element={<Delivery />} /> 
          <Route path="/product/:_id" element={<SingleProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProductPage />} />
          
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/messages" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminMessages />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/orders" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminOrders />
            </ProtectedRoute>
          } />
          
          <Route path="/order-confirmation/:orderId" element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          
          <Route path="/support" element={<Support />} />
          
          <Route path="/admin/support" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminSupport />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/*" element={<Dashboard />} />
          
          <Route path="/forget-password" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/contact" element={<Navigate to="/contactus" replace />} />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="*" element={
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                  404
                </h1>
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Page Not Found</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                
                <div className="space-y-4">
                  <p className="text-gray-500 dark:text-gray-400">Try these pages instead:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href="/" className="p-3 bg-gray-50 dark:bg-blue-900/30 hover:bg-gray-100 dark:hover:bg-blue-900/50 rounded-lg border border-gray-200 dark:border-blue-800/30 transition text-center">
                      Home
                    </a>
                    <a href="/products" className="p-3 bg-gray-50 dark:bg-blue-900/30 hover:bg-gray-100 dark:hover:bg-blue-900/50 rounded-lg border border-gray-200 dark:border-blue-800/30 transition text-center">
                      Products
                    </a>
                    <a href="/dashboard" className="p-3 bg-gray-50 dark:bg-purple-900/30 hover:bg-gray-100 dark:hover:bg-purple-900/50 rounded-lg border border-gray-200 dark:border-purple-800/30 transition text-center">
                      Dashboard
                    </a>
                    <a href="/support" className="p-3 bg-gray-50 dark:bg-green-900/30 hover:bg-gray-100 dark:hover:bg-green-900/50 rounded-lg border border-gray-200 dark:border-green-800/30 transition text-center">
                      Support
                    </a>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      If you believe this is an error, please <a href="/support" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">contact support</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>
      
      {!hideFooter && !hideHeaderNav && <Footer />}
      
      {!isDashboard && !hideHeaderNav && <ChatBox />}
    </div>
  );
}

const App = () => {
  return (
    <Router> 
      <ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="black"
        />
        <CartProvider>  
          <AppContent />
        </CartProvider>
      </ThemeProvider>
    </Router>     
  )
}

export default App