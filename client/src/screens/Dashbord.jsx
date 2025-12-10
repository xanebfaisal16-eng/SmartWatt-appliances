import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  FiUser, FiShoppingBag, FiSettings, FiHome, 
  FiMessageSquare, FiTruck, FiLogOut, FiShoppingCart,
  FiBell, FiCreditCard, FiPackage,
  FiShield, FiUsers, FiBarChart2, FiGrid,
  FiStar, FiHelpCircle, FiClock, FiLock,
  FiLoader, FiDollarSign, FiActivity, FiCloud,
  FiMail, FiX, FiMenu, FiChevronLeft, FiChevronRight,
  FiArrowLeft
} from 'react-icons/fi';
import { 
  MdStorefront, 
  MdLocalOffer, 
  MdDashboard,
  MdReceipt,
  MdSecurity,
  MdInventory,
  MdShoppingCart,
  MdVerifiedUser
} from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your components
import Profile from './Profile';
import Orders from './Orders';
import Settings from './Settings';
import Payments from './Payments';
import Shipping from './Delivery';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminMessages from './Adminmsgs';

// Professional Loading Component
const ProfessionalLoader = ({ message = "Loading dashboard data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1 left-1 w-18 h-18 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center">
          <FiCloud className="text-2xl text-blue-400" />
        </div>
      </div>
      <p className="mt-6 text-gray-300 text-lg font-medium">{message}</p>
      <p className="text-gray-500 text-sm mt-2">Securely fetching your data...</p>
      <div className="mt-4 flex items-center gap-2">
        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-75"></div>
        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

// Dashboard Home Component with REAL DATA
const DashboardHome = ({ isAdmin, userData, stats, refreshDashboard, handleCloseDashboard }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const handleManualRefresh = () => {
    refreshDashboard();
    toast.info('Refreshing dashboard data...');
  };

  const userStats = [
    { 
      label: 'Total Orders', 
      value: stats?.totalOrders || '0', 
      icon: <FiShoppingBag />, 
      color: 'from-blue-600 to-cyan-500',
      desc: `${stats?.pendingOrders || 0} pending orders`,
      link: '/dashboard/orders'
    },
    { 
      label: 'Account Status', 
      value: userData?.status || 'Active', 
      icon: <FiShield />, 
      color: 'from-purple-600 to-violet-500',
      desc: userData?.role === 'admin' ? 'Administrator' : 'Premium Member',
      link: '/dashboard/profile'
    },
  ];

  const adminStats = [
    { 
      label: 'Total Orders', 
      value: stats?.totalOrders || '0', 
      icon: <FiShoppingBag />, 
      color: 'from-green-700 to-emerald-600',
      desc: `${stats?.pendingOrders || 0} pending`,
      link: '/dashboard/admin/orders'
    },
    { 
      label: 'Total Revenue', 
      value: formatCurrency(stats?.totalRevenue || 0), 
      icon: <FiDollarSign />, 
      color: 'from-purple-700 to-pink-600',
      desc: 'Total sales amount',
      link: '/dashboard/admin/overview'
    },
    { 
      label: 'Active Products', 
      value: stats?.totalProducts || '0', 
      icon: <FiPackage />, 
      color: 'from-orange-700 to-red-600',
      desc: 'Available in store',
      link: '/dashboard/admin/products'
    },
  ];

  const recentActivities = stats?.recentActivities || [
    {
      id: 'welcome',
      icon: <FiActivity />,
      title: 'Welcome to Dashboard',
      description: 'Your account is now active. Start exploring!',
      time: 'Just now',
      status: 'info',
      color: 'text-blue-400'
    }
  ];

  if (stats?.loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
        <ProfessionalLoader message="Preparing your dashboard..." />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Welcome back, {userData?.name || userData?.first_name || 'User'}!
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              {userData?.email ? `Logged in as: ${userData.email}` : 'Manage your account'}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FiUser className="text-gray-500" />
                <span>Member since: {formatDate(userData?.createdAt)}</span>
              </div>
              {userData?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FiHelpCircle className="text-gray-500" />
                  <span>Phone: {userData.phone}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleManualRefresh}
              className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:from-blue-600/30 hover:to-cyan-600/30 transition flex items-center gap-2"
            >
              <FiActivity />
              Refresh Data
            </button>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              userData?.role === 'admin' 
                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300'
                : 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 text-blue-300'
            }`}>
              {userData?.role === 'admin' ? 'Administrator' : 'Premium Member'}
            </span>
            {userData?.isVerified && (
              <span className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full text-green-300">
                ✓ Verified Account
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {(isAdmin ? adminStats : userStats).map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="group block"
          >
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold">
                    {stat.value}
                  </p>
                  {stat.desc && (
                    <p className="text-gray-500 text-sm mt-2">{stat.desc}</p>
                  )}
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-white text-2xl">{stat.icon}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <span className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2">
                  View Details
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiUser /> Personal Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Full Name</p>
                <p className="font-medium">
                  {userData?.first_name && userData?.last_name 
                    ? `${userData.first_name} ${userData.last_name}`
                    : userData?.name || 'Not provided'
                  }
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Username</p>
                <p className="font-medium">{userData?.username || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email Address</p>
              <p className="font-medium">{userData?.email || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Phone Number</p>
                <p className="font-medium">{userData?.phone || userData?.mobile_number || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Account Type</p>
                <p className="font-medium">{userData?.role || 'User'}</p>
              </div>
            </div>
            {userData?.address && (
              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <p className="font-medium">{userData.address}</p>
                {userData?.city && (
                  <p className="text-sm text-gray-500">
                    {userData.city}, {userData.state} {userData.zipCode}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MdDashboard /> Account Overview
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Account Created</p>
                <p className="font-medium">{formatDate(userData?.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Updated</p>
                <p className="font-medium">{formatDate(userData?.updatedAt) || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Account Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-medium text-green-400">Active</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Verification Status</p>
              <div className="flex items-center gap-2 mt-1">
                {userData?.isVerified ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="font-medium text-green-400">Verified</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="font-medium text-yellow-400">Not Verified</span>
                  </>
                )}
              </div>
            </div>
            {userData?.gender && (
              <div>
                <p className="text-gray-400 text-sm">Gender</p>
                <p className="font-medium capitalize">{userData.gender}</p>
              </div>
            )}
            {userData?.dob && (
              <div>
                <p className="text-gray-400 text-sm">Date of Birth</p>
                <p className="font-medium">{formatDate(userData.dob)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">Recent Activity</h2>
              <p className="text-gray-400">Your latest account activities</p>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div 
                key={activity.id} 
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800/20 to-gray-900/20 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${activity.color} bg-opacity-10 flex items-center justify-center`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">{activity.title}</p>
                      <p className="text-gray-400">{activity.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold mb-8">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/products" className="p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition text-center group">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition`}>
                <MdStorefront className="text-white text-2xl" />
              </div>
              <p className="font-semibold">Browse Store</p>
              <p className="text-sm text-gray-400 mt-1">Shop products</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ loading: true });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close dashboard function
  const handleCloseDashboard = () => {
    navigate('/');
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Memoized fetch function
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUserData(data.user);
          setIsAdmin(['admin', 'Admin', 'IsAdmin'].includes(data.user.role));
          
          localStorage.setItem('userRole', data.user.role);
          localStorage.setItem('userName', data.user.name || `${data.user.first_name} ${data.user.last_name}`);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userId', data.user._id);
        } else {
          throw new Error(data.message || 'Failed to load user data');
        }
      } else {
        const errorText = await response.text();
        console.error('Profile error response:', errorText);
        toast.error('Failed to load user data');
        localStorage.clear();
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Connection error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStats({ loading: false });
        return;
      }

      const response = await fetch('http://localhost:8080/api/v1/users/dashboard-stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔄 Dashboard stats refreshed');
        
        if (data.success) {
          setStats({ 
            ...data.stats, 
            loading: false 
          });
        } else {
          setStats({ loading: false });
        }
      } else {
        setStats({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ loading: false });
    }
  }, []);

  useEffect(() => {
    const handleDashboardRefresh = () => {
      console.log('🎯 Dashboard received dashboard-refresh event');
      fetchDashboardStats();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔍 Page became visible, refreshing stats...');
        fetchDashboardStats();
      }
    };

    window.addEventListener('dashboard-refresh', handleDashboardRefresh);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    fetchUserData();
    fetchDashboardStats();

    const refreshInterval = setInterval(() => {
      console.log('⏰ Auto-refreshing dashboard stats...');
      fetchDashboardStats();
    }, 300000);

    return () => {
      window.removeEventListener('dashboard-refresh', handleDashboardRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, [fetchUserData, fetchDashboardStats]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const manualRefreshDashboard = () => {
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 w-20 h-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center">
              <MdVerifiedUser className="text-3xl text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Initializing Dashboard</h2>
          <p className="text-gray-300 text-lg mb-2">Securing your session...</p>
          <p className="text-gray-500">Fetching your account information</p>
          <div className="mt-6 flex justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
        <div className="absolute bottom-8 text-center">
          <p className="text-gray-600 text-sm">Powered by SmartWatt • Secure Connection • v1.0.0</p>
        </div>
      </div>
    );
  }

  // Professional Sidebar Menu Items
  const userMenuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard Overview', 
      icon: <MdDashboard />, 
      exact: true,
      desc: 'View your account summary'
    },
    { 
      path: '/dashboard/profile', 
      label: 'My Profile', 
      icon: <FiUser />,
      desc: 'Manage personal information'
    },
    { 
      path: '/dashboard/payments', 
      label: 'Payment Methods', 
      icon: <FiCreditCard />,
      desc: 'Manage payment options'
    },
    { 
      path: '/dashboard/shipping', 
      label: 'Shipping Addresses', 
      icon: <FiTruck />,
      desc: 'Update delivery locations'
    },
    { 
      path: '/dashboard/settings', 
      label: 'Account Settings', 
      icon: <FiSettings />,
      desc: 'Privacy & preferences'
    },
  ];

  const adminMenuItems = [
    { 
      path: '/dashboard/admin/orders', 
      label: 'Order Management', 
      icon: <MdReceipt />,
      desc: 'Process & track all orders'
    },
    { 
      path: '/dashboard/admin/messages', 
      label: 'Customer Messages', 
      icon: <FiMessageSquare />,
      desc: 'View & respond to inquiries'
    },
  ];

  const storeMenuItems = [
    {
      path: '/products',
      label: 'Browse Products',
      icon: <MdStorefront />,
      desc: 'Shop our collection',
      external: true
    },
    {
      path: '/products?category=featured',
      label: 'Featured Items',
      icon: <FiStar />,
      desc: 'Top rated products',
      external: true
    },
    {
      path: '/products?category=new',
      label: 'New Arrivals',
      icon: <FiClock />,
      desc: 'Latest products',
      external: true
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="flex">
        {/* Sidebar - Collapsed/Expanded based on state */}
        <div className={`${
          sidebarOpen ? 'w-80 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'
        } fixed lg:static inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-950/95 backdrop-blur-xl border-r border-gray-800 shadow-2xl overflow-hidden transition-all duration-300`}>
          
          {/* Sidebar Header */}
          <div className={`p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-gray-950/50 relative ${!sidebarOpen ? 'lg:p-4' : ''}`}>
            {/* Mobile Close Button (X) */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden absolute right-4 top-4 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition"
            >
              <FiX className="text-xl" />
            </button>
            
            {/* Desktop Toggle Button (Chevron) */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex absolute right-4 top-4 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition"
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {sidebarOpen ? <FiChevronLeft className="text-xl" /> : <FiChevronRight className="text-xl" />}
            </button>
            
            {/* Desktop Back to Home Button (only when expanded) */}
            {sidebarOpen && (
              <button
                onClick={handleCloseDashboard}
                className="hidden lg:flex absolute left-4 top-4 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition flex items-center gap-2"
                title="Back to Home"
              >
                <FiArrowLeft className="text-xl" />
                <span className="text-sm">Home</span>
              </button>
            )}
            
            <div className={`flex items-center gap-3 ${sidebarOpen ? 'pt-6' : 'pt-2 lg:justify-center'}`}>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {userData?.name?.charAt(0) || userData?.first_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-gray-900"></div>
              </div>
              {sidebarOpen && (
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-white tracking-tight">Dashboard</h1>
                  <p className="text-gray-400 text-sm truncate">{userData?.email || ''}</p>
                </div>
              )}
            </div>
          </div>

          {/* User Profile Card (only when expanded) */}
          {sidebarOpen && (
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900/30 to-gray-950/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {userData?.name?.charAt(0) || userData?.first_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-lg">
                    {userData?.name || `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'User'}
                  </p>
                  <p className="text-gray-400 text-sm truncate">{userData?.email || ''}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isAdmin 
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30'
                        : 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center p-2 rounded-lg bg-gray-800/30">
                  <p className="text-sm text-gray-400">Orders</p>
                  <p className="font-bold text-white">{stats?.totalOrders || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={`p-4 space-y-6 overflow-y-auto ${sidebarOpen ? 'h-[calc(100vh-360px)]' : 'h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)]'}`}>
            {/* Account Navigation */}
            <div>
              {sidebarOpen && (
                <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-3 px-3">
                  Account
                </p>
              )}
              <div className="space-y-1">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3.5' : 'px-3 py-3 lg:justify-center'} rounded-xl transition-all duration-300 relative overflow-hidden
                      ${(item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path))
                        ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/10 text-blue-300 border-l-4 border-blue-500 shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-l-4 hover:border-gray-700'
                      }`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <span className={`text-lg relative z-10 ${
                      (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path))
                        ? 'text-blue-400'
                        : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <div className="flex-1 relative z-10">
                        <span className="font-medium">{item.label}</span>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400">{item.desc}</p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Store Navigation */}
            <div>
              {sidebarOpen && (
                <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-3 px-3">
                  Store
                </p>
              )}
              <div className="space-y-1">
                {storeMenuItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`group flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3.5' : 'px-3 py-3 lg:justify-center'} rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <span className="text-lg text-gray-400 group-hover:text-green-400">
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <>
                        <div className="flex-1">
                          <span className="font-medium">{item.label}</span>
                          <p className="text-xs text-gray-500 group-hover:text-gray-400">{item.desc}</p>
                        </div>
                        <span className="text-sm text-gray-500 group-hover:text-green-400">↗</span>
                      </>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Admin Navigation */}
            {isAdmin && (
              <div>
                {sidebarOpen && (
                  <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-3 px-3">
                    Admin
                  </p>
                )}
                <div className="space-y-1">
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3.5' : 'px-3 py-3 lg:justify-center'} rounded-xl transition-all
                        ${location.pathname.startsWith(item.path)
                          ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/10 text-purple-300 border-l-4 border-purple-500'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`}
                      title={!sidebarOpen ? item.label : ''}
                    >
                      <span className="text-lg">
                        {item.icon}
                      </span>
                      {sidebarOpen && (
                        <div className="flex-1">
                          <span className="font-medium">{item.label}</span>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gradient-to-b from-gray-900/95 via-gray-900 to-gray-950">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3.5 
                       bg-gray-800/50 hover:bg-gray-800
                       text-gray-300 hover:text-white rounded-xl 
                       border border-gray-800 hover:border-gray-700 
                       transition-all font-medium ${!sidebarOpen ? 'lg:justify-center' : ''}`}
              title={!sidebarOpen ? "Logout" : ""}
            >
              <FiLogOut />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Toggle Button (Hamburger) */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden fixed bottom-6 left-6 z-50 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl"
          >
            <FiMenu className="text-2xl" />
          </button>
        )}

        {/* Main Content */}
        <div className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'
        }`}>
          {/* Top Bar */}
          <div className="sticky top-0 z-40 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-950/95 backdrop-blur-xl border-b border-gray-800 p-4 lg:p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {/* Sidebar Toggle Button */}
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition"
                  title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                  {sidebarOpen ? <FiChevronLeft className="text-xl" /> : <FiMenu className="text-xl" />}
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {location.pathname === '/dashboard' ? 'Dashboard Overview' :
                     location.pathname.includes('admin/orders') ? 'Order Management' :
                     location.pathname.includes('admin/messages') ? 'Customer Messages' :
                     location.pathname.includes('profile') ? 'My Profile' :
                     location.pathname.includes('settings') ? 'Account Settings' :
                     'Dashboard'}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {userData?.email || ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Close Dashboard Button */}
                <button
                  onClick={handleCloseDashboard}
                  className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-gray-600 transition flex items-center gap-2"
                  title="Close Dashboard"
                >
                  <FiX className="text-lg" />
                  <span className="hidden sm:inline">Close</span>
                </button>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg transition">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {userData?.name?.charAt(0) || userData?.first_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="font-medium text-white text-sm">
                        {userData?.name?.split(' ')[0] || userData?.first_name || 'User'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {isAdmin ? 'Administrator' : 'Premium User'}
                      </p>
                    </div>
                  </button>
                  
                  {/* User Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-700">
                      <p className="font-medium text-white">{userData?.email || ''}</p>
                      <p className="text-xs text-gray-400">Logged in</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition"
                      >
                        <FiUser />
                        My Profile
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition"
                      >
                        <FiSettings />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-red-600/20 rounded-lg text-red-300 hover:text-red-200 transition mt-2"
                      >
                        <FiLogOut />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-6 lg:p-8">
            <Routes>
              <Route 
                path="/" 
                element={
                  <DashboardHome 
                    isAdmin={isAdmin} 
                    userData={userData} 
                    stats={stats} 
                    refreshDashboard={manualRefreshDashboard}
                    handleCloseDashboard={handleCloseDashboard}
                  />
                } 
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/shipping" element={<Shipping />} />
              
              {/* Admin Routes */}
              <Route path="/admin/products" element={isAdmin ? <AdminProducts /> : <Navigate to="/dashboard" />} />
              <Route path="/admin/orders" element={isAdmin ? <AdminOrders /> : <Navigate to="/dashboard" />} />
              <Route path="/admin/messages" element={isAdmin ? <AdminMessages /> : <Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;