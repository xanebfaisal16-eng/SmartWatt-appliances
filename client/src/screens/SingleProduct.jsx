import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct, fetchProducts, deleteProduct } from '../redux/actions/prodActions';
import { useSelector, useDispatch } from 'react-redux';
import { TiStarFullOutline } from "react-icons/ti";
import { 
  TbShoppingCartFilled, 
  TbEdit, 
  TbTrash,
  TbChevronLeft,
  TbChevronRight,
  TbX,
  TbZoomIn,
  TbZoomOut,
  TbHome,
  TbCoffee,
  TbGrill,
  TbDeviceTv,
  TbToolsKitchen,
  TbArrowLeft,
  TbEye,
  TbRotate2,
  TbHandMove,
  TbMinus,
  TbPlus,
  TbBolt,
  TbSnowflake,
  TbCar,
  TbCpu
} from 'react-icons/tb';
import { useCart } from '../context/cartContext';
import { Link } from 'react-router-dom';
import { clearCurrentProduct } from '../redux/slices/prodSlice';

// Star Rating Display Component for decimal ratings
const StarRatingDisplay = ({ rating, size = "text-xl" }) => {
  const totalStars = 5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;
        const fillPercentage = Math.max(0, Math.min(100, (rating - index) * 100));
        
        return (
          <div key={index} className="relative">
            {/* Gray background star */}
            <span className={`${size} text-gray-300`}>★</span>
            {/* Colored overlay star */}
            {fillPercentage > 0 && (
              <div 
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <span className={`${size} text-yellow-500`}>★</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Button style constants for consistency
const buttonClasses = {
  primary: "px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg",
  secondary: "px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-300",
  danger: "px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg",
  success: "px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg",
  ghost: "px-4 py-2 bg-transparent hover:bg-gray-100 text-gray-600 rounded-lg transition-all duration-200"
};

// Shadow hierarchy
const shadows = {
  sm: "shadow-sm hover:shadow",
  md: "shadow-md hover:shadow-lg",
  lg: "shadow-lg hover:shadow-xl",
  xl: "shadow-xl hover:shadow-2xl"
};

// Helper function for category filtering
const filterByCategory = (products, category) => {
  if (!products || !category) return [];
  
  const categoryMap = {
    home: ['home appliance', 'home appliances', 'home', 'living', 'bedroom', 'furniture', 'decor', 'interior', 'fan', 'humidifier', 'lamp', 'alarm', 'table fan', 'cool mist', 'ultrasonic', 'digital alarm', 'table lamp'],
    kitchen: ['kitchen appliance', 'kitchen appliances', 'kitchen', 'cook', 'utensil', 'appliance', 'cookware', 'cutlery', 'toaster', 'kettle', 'mixer', 'fryer', 'popcorn', 'ice cream', 'air fryer', 'hand mixer'],
    outdoor: ['outdoor appliance', 'outdoor appliances', 'outdoor', 'garden', 'patio', 'bbq', 'lawn', 'backyard', 'grill', 'heater', 'fire pit', 'garden light', 'cooler', 'portable bbq', 'patio heater', 'solar led', 'ice cooler'],
    motors: ['motors', 'motor', 'electrical parts', 'electrical', 'dc motor', 'industrial motor', 'generator', 'robotics', 'air pump', '2hp', 'high torque', 'mini generator', 'tt motor', 'electric air'],
    cooling: ['refrigerators', 'cooling', 'refrigerator', 'fridge', 'freezer', 'cooler', 'mini fridge', 'car refrigerator', 'single door', 'small home', '6l', '12v'],
    appliances: ['appliance', 'electronic', 'device', 'tech', 'home appliance', 'electric', 'all']
  };

  const keywords = categoryMap[category.toLowerCase()] || [category.toLowerCase()];
  
  return products.filter(product => {
    const productCategory = product.category?.toLowerCase() || '';
    const productTitle = product.title?.toLowerCase() || '';
    const productDescription = product.description?.toLowerCase() || '';
    const productBrand = product.brand?.toLowerCase() || '';
    
    // Check if any keyword matches category, title, description, or brand
    return keywords.some(keyword => 
      productCategory.includes(keyword) || 
      productTitle.includes(keyword) ||
      productDescription.includes(keyword) ||
      productBrand.includes(keyword)
    );
  });
};

const SingleProduct = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get products data from Redux
  const { product, products, loading } = useSelector(state => state.prodSlice);
  
  // Get user data - UPDATED TO CHECK SELLER TOO
  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      // Check if user is Admin OR Seller
      if (user) {
        user.isAdminOrSeller = user.role === 'admin' || 
                                user.role === 'ADMIN' || 
                                user.role === 'seller' || 
                                user.role === 'SELLER';
      }
      return user;
    } catch (error) {
      console.error("Error getting user from localStorage:", error);
      return null;
    }
  };
  
  const user = getUserFromStorage();
  const isAdminOrSeller = user?.isAdminOrSeller || false;
  const { addToCart } = useCart();

  // Category configuration with improved gradient colors
  const categories = [
    { 
      id: 'home', 
      name: 'Home Appliances', 
      icon: <TbHome />, 
      color: 'from-blue-500 via-blue-600 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100'
    },
    { 
      id: 'kitchen', 
      name: 'Kitchen Appliances', 
      icon: <TbToolsKitchen />, 
      color: 'from-emerald-500 via-green-600 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-100'
    },
    { 
      id: 'outdoor', 
      name: 'Outdoor Appliances', 
      icon: <TbGrill />, 
      color: 'from-orange-500 via-amber-600 to-yellow-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-100'
    },
    { 
      id: 'motors', 
      name: 'Motors & Electrical', 
      icon: <TbBolt />, 
      color: 'from-red-500 via-rose-600 to-pink-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-pink-100'
    },
    { 
      id: 'cooling', 
      name: 'Refrigerators & Cooling', 
      icon: <TbSnowflake />, 
      color: 'from-cyan-500 via-sky-600 to-blue-600',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-blue-100'
    },
    { 
      id: 'appliances', 
      name: 'All Appliances', 
      icon: <TbDeviceTv />, 
      color: 'from-purple-500 via-violet-600 to-fuchsia-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-fuchsia-100'
    }
  ];

  // State management
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [zoomedProductId, setZoomedProductId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomTransform, setZoomTransform] = useState({ x: 50, y: 50 });
  const [viewMode, setViewMode] = useState('categories');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeZoomProduct, setActiveZoomProduct] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  
  const categoriesRef = useRef(null);
  const productsRef = useRef(null);
  const zoomTimerRef = useRef(null);
  const imageRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Load data
  useEffect(() => {
    console.log("🔄 Loading product and products...");
    dispatch(fetchProduct(_id));
    dispatch(fetchProducts());
    
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [_id, dispatch]);

  // Initialize with current product
  useEffect(() => {
    if (product) {
      console.log("✅ Product loaded:", product.title);
      setSelectedProducts([product]);
    }
  }, [product]);

  // Check when products are loaded
  useEffect(() => {
    if (products && products.length > 0) {
      console.log("✅ All products loaded:", products.length);
      setAllProductsLoaded(true);
    }
  }, [products]);

  // Load category products when category is selected
  useEffect(() => {
    if (selectedCategory && products && products.length > 0) {
      console.log(`🔍 Filtering products for category: ${selectedCategory.name}`);
      const filtered = filterByCategory(products, selectedCategory.id);
      console.log(`✅ Found ${filtered.length} products for ${selectedCategory.name}`);
      setCategoryProducts(filtered.slice(0, 12));
    } else if (selectedCategory && (!products || products.length === 0)) {
      console.log("⚠️ No products available for filtering");
      setCategoryProducts([]);
    }
  }, [selectedCategory, products]);

  // Add event listener cleanup
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    };
  }, []);

  // Enhanced mouse handlers for professional zoom
  const handleMouseMove = (e, productId) => {
    if (zoomedProductId === productId) {
      if (isDragging && zoomLevel > 1) {
        e.preventDefault();
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        
        setZoomPosition(prev => ({
          x: prev.x + deltaX * 0.5,
          y: prev.y + deltaY * 0.5
        }));
        
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      } else if (zoomLevel > 1) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomTransform({ x, y });
      }
    }
  };

  const handleMouseDown = (e) => {
    if (zoomedProductId && zoomLevel > 1) {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
  };

  const handleMouseEnter = (productId) => {
    if (window.innerWidth >= 768) {
      zoomTimerRef.current = setTimeout(() => {
        setZoomedProductId(productId);
        setZoomLevel(2.5);
        setZoomPosition({ x: 0, y: 0 });
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    if (!isDragging) {
      setZoomedProductId(null);
      setZoomLevel(1);
      setZoomTransform({ x: 50, y: 50 });
      setZoomPosition({ x: 0, y: 0 });
      setIsDragging(false);
      document.body.style.cursor = '';
    }
  };

  const toggleZoom = (productId) => {
    if (window.innerWidth < 768) {
      navigate(`/product/${productId}`);
      return;
    }
    
    if (zoomedProductId === productId) {
      setZoomedProductId(null);
      setZoomLevel(1);
      setActiveZoomProduct(null);
      setZoomPosition({ x: 0, y: 0 });
      setIsDragging(false);
      document.body.style.cursor = '';
    } else {
      setZoomedProductId(productId);
      setZoomLevel(2.5);
      setActiveZoomProduct(productId);
      setZoomPosition({ x: 0, y: 0 });
    }
  };

  const adjustZoom = (amount) => {
    const newZoom = Math.max(1, Math.min(5, zoomLevel + amount));
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setZoomPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setZoomPosition({ x: 0, y: 0 });
    setZoomTransform({ x: 50, y: 50 });
  };

  // Category selection with animation
  const handleCategoryClick = (category) => {
    console.log(`🎯 Category selected: ${category.name}`);
    setSelectedCategory(category);
    setViewMode('products');
    
    setTimeout(() => {
      if (productsRef.current) {
        productsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 150);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setViewMode('categories');
    setCategoryProducts([]);
    setZoomedProductId(null);
    setActiveZoomProduct(null);
    setZoomLevel(1);
    setZoomPosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Product selection with toast notifications
  const addToSelectedProducts = (productToAdd) => {
    if (!selectedProducts.some(p => p._id === productToAdd._id)) {
      setSelectedProducts(prev => [...prev, productToAdd]);
      showNotification(`✅ "${productToAdd.title}" added to comparison`);
    } else {
      showNotification(`⚠️ "${productToAdd.title}" is already in comparison`);
    }
  };

  const removeFromSelectedProducts = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== productId));
    showNotification(`🗑️ Product removed from comparison`);
  };

  // Toast notification function
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg bg-gray-900 text-white shadow-xl transform transition-all duration-300 translate-x-0 opacity-100 font-medium';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  // Scroll functions with boundaries
  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = direction * 320;
      categoriesRef.current.scrollLeft += scrollAmount;
    }
  };

  const scrollProducts = (direction) => {
    if (productsRef.current) {
      const scrollAmount = direction * 350;
      productsRef.current.scrollLeft += scrollAmount;
    }
  };

  // Add to cart function
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    showNotification(`🛒 "${product.title}" added to cart!`);
  };

  // Admin actions
  const handleDelete = async (productId) => {
    // Check permission
    if (!isAdminOrSeller) {
      showNotification('❌ Admin or Seller privileges required to delete products');
      return;
    }
    
    const productToDelete = selectedProducts.find(p => p._id === productId) || 
                           categoryProducts.find(p => p._id === productId) ||
                           product;
    
    if (!productToDelete) {
      showNotification('❌ Product not found');
      return;
    }
    
    if (!window.confirm(`Delete "${productToDelete.title}"?\nThis action cannot be undone!`)) return;

    try {
      await dispatch(deleteProduct(productId));
      removeFromSelectedProducts(productId);
      showNotification('✅ Product deleted successfully!');
      
      // Navigate back if we deleted the current product
      if (productId === _id) {
        navigate('/products');
      }
    } catch (error) {
      showNotification(`❌ Error: ${error.message || 'Failed to delete product'}`);
    }
  };

  const handleEdit = (productId) => {
    // Check permission
    if (!isAdminOrSeller) {
      showNotification('❌ Admin or Seller privileges required to edit products');
      return;
    }
    navigate(`/admin/products/edit/${productId}`);
  };

  // Main product details display
  const renderProductDetails = () => {
    if (!product) return null;

    return (
      <div className="mb-16 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Product Image Section */}
          <div className="relative">
            <div className={`relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden ${
              zoomedProductId === product._id ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
            }`}
            onMouseEnter={() => handleMouseEnter(product._id)}
            onMouseMove={(e) => handleMouseMove(e, product._id)}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}>
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
              )}
              
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-500 text-sm">Image not available</p>
                  </div>
                </div>
              ) : (
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=800&h=600&fit=crop&q=80'}
                  alt={product.title}
                  className={`w-full h-full object-contain transition-transform duration-300 ease-out ${
                    zoomedProductId === product._id ? 'scale-125' : ''
                  }`}
                  style={{
                    transform: zoomedProductId === product._id 
                      ? `scale(${zoomLevel}) translate(${zoomPosition.x}px, ${zoomPosition.y}px)`
                      : 'scale(1) translate(0, 0)',
                    transformOrigin: `${zoomTransform.x}% ${zoomTransform.y}%`,
                    imageRendering: zoomLevel > 2 ? 'crisp-edges' : 'auto'
                  }}
                  onLoad={() => {
                    setImageLoaded(true);
                    setImageError(false);
                  }}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(true);
                  }}
                  loading="lazy"
                />
              )}
              
              {/* Zoom Controls */}
              {zoomedProductId === product._id && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={() => adjustZoom(-0.5)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
                    aria-label="Zoom out"
                  >
                    <TbMinus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={resetZoom}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
                    aria-label="Reset zoom"
                  >
                    <TbRotate2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => adjustZoom(0.5)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
                    aria-label="Zoom in"
                  >
                    <TbPlus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Zoom Status Indicator */}
            {zoomedProductId === product._id && (
              <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                Zoom: {zoomLevel.toFixed(1)}x {isDragging ? '• Dragging' : '• Hover to pan'}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full">
                    {product.category || 'Electronics'}
                  </span>
                  {product.stock > 0 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
                
                {isAdminOrSeller && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      title="Edit Product"
                      aria-label="Edit product"
                    >
                      <TbEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      title="Delete Product"
                      aria-label="Delete product"
                    >
                      <TbTrash className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <StarRatingDisplay rating={product.rating || 4.5} size="text-2xl" />
                  <span className="ml-2 text-gray-700 font-medium">
                    {product.rating || 4.5}/5
                  </span>
                </div>
               
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price?.toLocaleString() || '0.00'}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>
              
              {product.shipping && (
                <div className="mt-4 text-green-700 font-medium">
                  ✓ {product.shipping}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Brand & Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.brand && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Brand</div>
                  <div className="font-medium">{product.brand}</div>
                </div>
              )}
              {product.warranty && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Warranty</div>
                  <div className="font-medium">{product.warranty}</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
                className={`flex-1 ${buttonClasses.primary} ${
                  product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                } flex items-center justify-center gap-3 py-3.5`}
              >
                <TbShoppingCartFilled className="w-6 h-6" />
                <span className="text-lg font-semibold">
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </span>
              </button>
              
              <button
                onClick={() => addToSelectedProducts(product)}
                className={`flex-1 ${buttonClasses.success} flex items-center justify-center gap-3 py-3.5`}
              >
                <span className="text-xl font-bold">+</span>
                <span className="text-lg font-semibold">Compare</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-10"></div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72 h-36 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Product Not Found State
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <TbX className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/products')}
          className={buttonClasses.primary + " w-full py-3 text-lg"}
        >
          Browse All Products
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {viewMode === 'categories' ? 'Browse Categories' : 
               selectedCategory ? `${selectedCategory.name}` : 
               'Product Details'}
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              {viewMode === 'categories' ? 'Select a category to explore related products' :
               'Hover/click to zoom • Drag to pan • Professional-grade viewing'}
            </p>
          </div>
          
          {viewMode === 'products' && (
            <button
              onClick={handleBackToCategories}
              className={buttonClasses.secondary + " flex items-center gap-2 whitespace-nowrap"}
              aria-label="Back to categories"
            >
              <TbArrowLeft className="w-5 h-5" />
              Back to Categories
            </button>
          )}
        </div>

        {/* Main Product Details */}
        {viewMode === 'categories' && renderProductDetails()}

        {/* Categories Slider */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
              <p className="text-gray-600 mt-1">Click to explore products in each category</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCategories(-1)}
                className="p-2.5 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!allProductsLoaded}
                aria-label="Scroll categories left"
              >
                <TbChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => scrollCategories(1)}
                className="p-2.5 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!allProductsLoaded}
                aria-label="Scroll categories right"
              >
                <TbChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="relative group">
            {!allProductsLoaded && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-center rounded-3xl">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-blue-600 border-t-transparent"></div>
                  <p className="mt-3 text-gray-700 font-medium">Loading products...</p>
                </div>
              </div>
            )}
            
            <div
              ref={categoriesRef}
              className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-4 -m-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'thin' }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  disabled={!allProductsLoaded}
                  className={`flex-shrink-0 transition-all duration-500 snap-start ${
                    selectedCategory?.id === category.id 
                      ? 'scale-105 ring-3 ring-offset-2 ring-blue-400' 
                      : 'hover:scale-102'
                  } ${!allProductsLoaded ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={`Browse ${category.name} category`}
                >
                  <div className={`w-72 sm:w-80 h-36 rounded-2xl bg-gradient-to-br ${category.color} p-6 flex flex-col justify-between ${shadows.lg} hover:shadow-2xl transition-all duration-500`}>
                    <div className="flex justify-between items-start">
                      <div className="text-4xl text-white/95 backdrop-blur-sm bg-white/10 p-3 rounded-2xl">
                        {category.icon}
                      </div>
                      {selectedCategory?.id === category.id && (
                        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">{category.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-white/90 text-sm">
                          {allProductsLoaded ? 'Explore products →' : 'Loading...'}
                        </p>
                        <div className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ${
                          !allProductsLoaded && 'animate-pulse'
                        }`}>
                          {allProductsLoaded ? (
                            <div className="text-white">→</div>
                          ) : (
                            <TbRotate2 className="w-4 h-4 text-white animate-spin" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Products Section */}
        {viewMode === 'products' && selectedCategory && (
          <div ref={productsRef} className="mb-16 scroll-mt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center shadow-lg`}>
                  <div className="text-3xl text-white">
                    {selectedCategory.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {selectedCategory.name} Collection
                  </h2>
                  <p className="text-gray-600">
                    {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 self-end sm:self-auto">
                <button
                  onClick={() => scrollProducts(-1)}
                  className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  aria-label="Scroll products left"
                >
                  <TbChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => scrollProducts(1)}
                  className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  aria-label="Scroll products right"
                >
                  <TbChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {categoryProducts.length > 0 ? (
              <div className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-4 -m-4">
                {categoryProducts.map((prod) => {
                  const isZoomed = zoomedProductId === prod._id;
                  const isActive = activeZoomProduct === prod._id;
                  
                  return (
                    <div
                      key={prod._id}
                      className={`flex-shrink-0 transition-all duration-500 ${
                        isZoomed 
                          ? 'scale-125 z-40 shadow-2xl' 
                          : zoomedProductId 
                          ? 'scale-90 opacity-60 blur-[1px]' 
                          : 'hover:scale-105'
                      }`}
                      style={{
                        width: isZoomed ? '480px' : '320px',
                        minWidth: isZoomed ? '480px' : '320px',
                        margin: isZoomed ? '0 40px' : '0',
                      }}
                      onMouseEnter={() => handleMouseEnter(prod._id)}
                      onMouseMove={(e) => handleMouseMove(e, prod._id)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => window.innerWidth < 768 && navigate(`/product/${prod._id}`)}
                    >
                      <div className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 ${shadows.lg} ${
                        isZoomed ? 'border-blue-400 ring-2 ring-blue-200 ring-opacity-50' : 
                        isActive ? 'border-blue-300' : 
                        'border-gray-200 hover:border-blue-300'
                      }`}>
                        {/* Product Header */}
                        <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                                selectedCategory?.id === 'home' ? 'bg-blue-100 text-blue-800' :
                                selectedCategory?.id === 'kitchen' ? 'bg-emerald-100 text-emerald-800' :
                                selectedCategory?.id === 'outdoor' ? 'bg-amber-100 text-amber-800' :
                                selectedCategory?.id === 'motors' ? 'bg-red-100 text-red-800' :
                                selectedCategory?.id === 'cooling' ? 'bg-cyan-100 text-cyan-800' :
                                selectedCategory?.id === 'appliances' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {prod.category || selectedCategory?.name}
                              </span>
                              {prod.stock > 0 ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  In Stock
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              {/* Admin/Seller Edit Button */}
                              {isAdminOrSeller && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(prod._id);
                                  }}
                                  className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                  title="Edit Product"
                                  aria-label="Edit product"
                                >
                                  <TbEdit className="w-4 h-4" />
                                </button>
                              )}
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleZoom(prod._id);
                                }}
                                className={`p-2.5 rounded-xl transition-all duration-300 ${
                                  isZoomed 
                                    ? 'bg-blue-100 text-blue-600 shadow-inner ring-1 ring-blue-200' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                              >
                                {isZoomed ? (
                                  <TbZoomOut className="w-5 h-5" />
                                ) : (
                                  <TbZoomIn className="w-5 h-5" />
                                )}
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToSelectedProducts(prod);
                                }}
                                className="p-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                title="Add to comparison"
                                aria-label="Add to product comparison"
                              >
                                <span className="font-bold text-lg">+</span>
                              </button>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug">
                            {prod.title}
                          </h3>
                        </div>

                        {/* Professional Zoom Container */}
                        <div className={`relative h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ${
                          isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                        }`}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={() => {
                          if (isZoomed && !isDragging) {
                            handleMouseLeave();
                          }
                        }}>
                          {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                          )}
                          
                          {/* Fallback for image error */}
                          {imageError ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <div className="text-center">
                                <div className="text-4xl mb-2">📷</div>
                                <p className="text-gray-500 text-sm">Image not available</p>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={prod.images?.[0] || 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=800&h=600&fit=crop&q=80'}
                              alt={prod.title}
                              className={`w-full h-full object-contain transition-transform duration-300 ease-out ${
                                isZoomed ? 'scale-125' : ''
                              }`}
                              style={{
                                transform: isZoomed 
                                  ? `scale(${zoomLevel}) translate(${zoomPosition.x}px, ${zoomPosition.y}px)`
                                  : 'scale(1) translate(0, 0)',
                                transformOrigin: `${zoomTransform.x}% ${zoomTransform.y}%`,
                                imageRendering: zoomLevel > 2 ? 'crisp-edges' : 'auto'
                              }}
                              onLoad={() => {
                                setImageLoaded(true);
                                setImageError(false);
                              }}
                              onError={() => {
                                setImageError(true);
                                setImageLoaded(true);
                              }}
                              loading="lazy"
                            />
                          )}
                          
                          {/* Zoom Controls Overlay */}
                          {isZoomed && (
                            <>
                              {/* Zoom Level Indicator */}
                              <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                Zoom: {zoomLevel.toFixed(1)}x {isDragging ? '• Dragging' : '• Hover to pan'}
                              </div>
                              
                              {/* Zoom Control Buttons */}
                              <div className="absolute bottom-4 right-4 flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    adjustZoom(-0.5);
                                  }}
                                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
                                  aria-label="Zoom out"
                                >
                                  <TbMinus className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    resetZoom();
                                  }}
                                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
                                  aria-label="Reset zoom"
                                >
                                  <TbRotate2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    adjustZoom(0.5);
                                  }}
                                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
                                  aria-label="Zoom in"
                                >
                                  <TbPlus className="w-5 h-5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Product Footer */}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <StarRatingDisplay rating={prod.rating || 4} size="text-lg" />
                              <span className="text-sm text-gray-600">
                                {prod.rating?.toFixed(1) || '4.0'}
                              </span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                              ${prod.price?.toLocaleString() || '0.00'}
                            </span>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(prod);
                              }}
                              disabled={prod.stock <= 0}
                              className={`flex-1 ${buttonClasses.primary} ${
                                prod.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                              } flex items-center justify-center gap-2 py-2.5`}
                            >
                              <TbShoppingCartFilled className="w-5 h-5" />
                              <span>{prod.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${prod._id}`);
                              }}
                              className={buttonClasses.secondary + " px-4 flex items-center justify-center"}
                              aria-label="View details"
                            >
                              <TbEye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <TbDeviceTv className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  No products available in the {selectedCategory.name} category yet.
                </p>
                <button
                  onClick={handleBackToCategories}
                  className={buttonClasses.primary + " px-6 py-3"}
                >
                  Browse Other Categories
                </button>
              </div>
            )}
          </div>
        )}

        {/* Selected Products Comparison */}
        {selectedProducts.length > 1 && (
          <div className="mt-16 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Product Comparison</h3>
                <p className="text-gray-600">Compare {selectedProducts.length} selected products</p>
              </div>
              <button
                onClick={() => setSelectedProducts([])}
                className={buttonClasses.secondary + " px-4 py-2"}
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedProducts.map((prod) => (
                <div key={prod._id} className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-gray-900 line-clamp-2">{prod.title}</h4>
                    <button
                      onClick={() => removeFromSelectedProducts(prod._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove from comparison"
                    >
                      <TbX className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-bold text-gray-900">${prod.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <span className="flex items-center gap-1">
                        <StarRatingDisplay rating={prod.rating || 0} size="text-sm" />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stock:</span>
                      <span className={prod.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {prod.stock > 0 ? `${prod.stock} available` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct; // MAKE SURE THIS LINE IS PRESENT