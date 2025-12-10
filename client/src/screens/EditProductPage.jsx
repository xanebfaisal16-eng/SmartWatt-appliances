import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduct, updateProduct, deleteProduct } from '../redux/actions/prodActions';
import { 
  TbArrowLeft, 
  TbCheck, 
  TbX,
  TbTrash,
  TbPhoto,
  TbUpload,
  TbFolderOpen,
  TbEdit,
  TbUser,
  TbShield
} from 'react-icons/tb';

// Use emojis for unavailable icons
const categoryEmojis = {
  'Televisions': '📺',
  'Refrigerators': '❄️', 
  'Washing Machines': '🧺',
  'AC & Coolers': '❄️',
  'Microwaves': '🍽️',
  'Coffee Makers': '☕',
  'Vacuum Cleaners': '🧹',
  'Kitchen Appliances': '🔪',
  'Entertainment': '🎮',
  'Audio': '🔊',
  'Heaters': '🔥'
};

// Component for displaying partial stars
const StarRatingDisplay = ({ rating, size = "text-3xl" }) => {
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

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  // Get product data
  const { product, loading } = useSelector(state => state.prodSlice);
  
  // User check
  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  };
  
  const user = getUserFromStorage();
  
  // Check if user is Admin OR Seller
  const isAdminOrSeller = user && (
    user.role === 'admin' || 
    user.role === 'ADMIN' || 
    user.role === 'seller' || 
    user.role === 'SELLER'
  );
  
  // Get user role for display
  const userRole = user?.role || 'guest';
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    stock: 0,
    images: [],
    rating: 0,
    numberofReviews: 0,
    features: [],
    warranty: '1 Year',
    powerConsumption: '',
    dimensions: '',
    color: '',
    weight: ''
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  const [uploadingImages, setUploadingImages] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load product data
  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [id, dispatch]);

  // Populate form when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
        brand: product.brand || '',
        stock: product.stock || 0,
        images: product.images || [],
        rating: product.rating || 0,
        numberofReviews: product.numberofReviews || 0,
        features: product.features || [],
        warranty: product.warranty || '1 Year',
        powerConsumption: product.powerConsumption || '',
        dimensions: product.dimensions || '',
        color: product.color || '',
        weight: product.weight || ''
      });
    }
  }, [product]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const numericFields = ['price', 'stock', 'rating'];
    const processedValue = numericFields.includes(name) ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle star click (sets to whole number)
  const handleStarClick = (starValue) => {
    setFormData(prev => ({
      ...prev,
      rating: starValue
    }));
  };

  // Handle image upload
  const handleImageUpload = useCallback((files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setImageUploadProgress(10);

    try {
      // Create preview URLs for selected files
      const imagePreviews = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type
      }));

      setUploadingImages(prev => [...prev, ...imagePreviews]);
      setImageUploadProgress(50);

      // Simulate upload delay
      setTimeout(() => {
        setImageUploadProgress(100);
        
        // Add to images array after upload simulation
        setTimeout(() => {
          const newImageUrls = imagePreviews.map(img => img.preview);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImageUrls]
          }));
          
          // Clear uploading images
          setUploadingImages([]);
          setImageUploadProgress(0);
          setIsUploading(false);
          
          alert(`✅ ${files.length} image(s) uploaded successfully!`);
        }, 500);
      }, 1000);

    } catch (error) {
      console.error('Image upload error:', error);
      alert('❌ Failed to upload images');
      setIsUploading(false);
      setImageUploadProgress(0);
    }
  }, []);

  // File input change handler
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
    
    // Reset file input to allow selecting same files again
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  }, [handleImageUpload]);

  // Remove image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Remove uploading image
  const removeUploadingImage = (index) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(uploadingImages[index].preview);
    setUploadingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      uploadingImages.forEach(img => {
        URL.revokeObjectURL(img.preview);
      });
    };
  }, [uploadingImages]);

  // Trigger file input click
  const handleChooseImagesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Add new feature
  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Appliances categories
  const applianceCategories = [
    'Televisions',
    'Refrigerators', 
    'Washing Machines',
    'AC & Coolers',
    'Microwaves',
    'Coffee Makers',
    'Vacuum Cleaners',
    'Kitchen Appliances',
    'Entertainment',
    'Audio',
    'Heaters'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle product update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }
    
    if (!isAdminOrSeller) {
      alert('❌ Admin or Seller privileges required to edit products');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        brand: formData.brand,
        stock: formData.stock,
        rating: formData.rating,
        features: formData.features,
        warranty: formData.warranty,
        powerConsumption: formData.powerConsumption,
        dimensions: formData.dimensions,
        color: formData.color,
        weight: formData.weight,
        images: formData.images
      };
      
      const result = await dispatch(updateProduct(id, updateData));
      
      if (result?.success) {
        alert('✅ Product updated successfully!');
        navigate(`/product/${id}`);
      } else {
        alert('⚠️ Product updated!');
        navigate(`/product/${id}`);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message || 'Failed to update product'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!isAdminOrSeller) {
      alert('❌ Admin or Seller privileges required to delete products');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone!')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const result = await dispatch(deleteProduct(id));
      
      if (result?.success) {
        alert('✅ Product deleted successfully!');
        navigate('/products');
      } else {
        alert('⚠️ Product deleted!');
        navigate('/products');
      }
    } catch (error) {
      alert(`❌ Error: ${error.message || 'Failed to delete product'}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading appliance details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">Appliance Not Found</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
          >
            Browse Appliances
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-8 px-4">
      {/* Style for text color */}
      <style>{`
        input, textarea, select {
          color: #111827 !important;
        }
        input::placeholder, textarea::placeholder {
          color: #9ca3af !important;
        }
        .file-input-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        id="fileInput"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="file-input-hidden"
        aria-label="Upload images"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/product/${id}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium"
          >
            <TbArrowLeft className="w-5 h-5" />
            Back to Appliance
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Appliance</h1>
              <p className="text-gray-600 mt-1">Update product specifications and details</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* User Role Badge */}
              <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                isAdminOrSeller 
                  ? userRole.toLowerCase() === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {userRole.toLowerCase() === 'admin' ? (
                  <TbShield className="w-4 h-4" />
                ) : (
                  <TbUser className="w-4 h-4" />
                )}
                <span className="text-sm font-medium capitalize">
                  {isAdminOrSeller ? `${userRole} Mode` : 'View Only'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                Product ID: <span className="font-mono font-bold">{id?.substring(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm">
            {['basic', 'specs', 'features', 'images'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tab === 'basic' && 'Basic Info'}
                {tab === 'specs' && 'Specifications'}
                {tab === 'features' && 'Features'}
                {tab === 'images' && 'Images'}
              </button>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Content */}
          <div className="p-8">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Appliance Name *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Samsung 4K Smart TV 55-inch"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl appearance-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Category</option>
                        {applianceCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {formData.category && categoryEmojis[formData.category] && (
                        <div className="absolute right-4 top-3.5 text-xl">
                          {categoryEmojis[formData.category]}
                        </div>
                      )}
                    </div>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  {/* Brand - CHANGED FROM SELECT TO INPUT TEXT */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                        errors.brand ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Samsung, LG, Sony (type any brand)"
                    />
                    {errors.brand && (
                      <p className="mt-2 text-sm text-red-600">{errors.brand}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0.01"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                        errors.stock ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter stock quantity"
                    />
                    {errors.stock && (
                      <p className="mt-2 text-sm text-red-600">{errors.stock}</p>
                    )}
                  </div>

                  {/* Rating - FULL WIDTH NOW */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Customer Rating (0-5)
                    </label>
                    <div className="space-y-6 p-4 bg-gray-50 rounded-xl">
                      {/* Star display - shows exact decimal values */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-center">
                          <StarRatingDisplay rating={formData.rating} />
                          <div className="mt-2 text-2xl font-bold text-blue-600">
                            {formData.rating.toFixed(1)} / 5.0
                          </div>
                        </div>
                        
                        {/* Star click buttons (for whole numbers) */}
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-gray-600 mr-2">Click stars:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => handleStarClick(star)}
                              className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                            >
                              <span className={star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'}>
                                ★
                              </span>
                            </button>
                          ))}
                        </div>
                        
                        {/* Numeric slider for precise control */}
                        <div className="w-full max-w-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">0.0</span>
                            <span className="text-sm text-gray-600">Precise control:</span>
                            <span className="text-sm text-gray-600">5.0</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              name="rating"
                              value={formData.rating}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                              className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                            />
                            <input
                              type="number"
                              name="rating"
                              value={formData.rating}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center text-gray-900"
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">Slide for exact values like 2.3, 3.7, 4.1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Detailed description of the appliance..."
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Warranty Period
                  </label>
                  <select
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="10 Years">10 Years</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Power Consumption
                  </label>
                  <input
                    type="text"
                    name="powerConsumption"
                    value={formData.powerConsumption}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., 1500W, Energy Star Rated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Dimensions (W x H x D)
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., 55″ x 32″ x 3″"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., 25 kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Color / Finish
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., Stainless Steel, Black"
                  />
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Key Features
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <span className="text-gray-800">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <TbX className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Add New Feature
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="e.g., Smart Connectivity, Energy Efficient"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                {/* Current Images */}
                {formData.images.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        Current Images ({formData.images.length})
                      </label>
                      <button
                        type="button"
                        onClick={handleChooseImagesClick}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
                      >
                        <TbFolderOpen className="w-4 h-4" />
                        Add More
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Appliance ${index + 1}`}
                            className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                              <TbTrash className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploading Images Preview */}
                {uploadingImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Uploading Images ({uploadingImages.length})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadingImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img.preview}
                            alt={`Uploading ${index + 1}`}
                            className="w-full h-48 object-cover rounded-xl border-2 border-blue-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeUploadingImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                          >
                            <TbX className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-600 h-1">
                            <div 
                              className="bg-green-500 h-1 transition-all duration-300"
                              style={{ width: `${imageUploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Section */}
                <div 
                  className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={handleChooseImagesClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload images area"
                  onKeyPress={(e) => e.key === 'Enter' && handleChooseImagesClick()}
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                      ) : (
                        <TbUpload className="w-10 h-10 text-blue-600" />
                      )}
                    </div>
                    
                    {isUploading ? (
                      <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-800">
                          Uploading Images...
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${imageUploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {imageUploadProgress}% complete
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-800 mb-2">
                          Upload Appliance Images
                        </p>
                        <p className="text-gray-600 mb-6">
                          {isDragOver ? (
                            <span className="text-blue-600 font-medium">Drop files here</span>
                          ) : (
                            <>
                              <span className="text-blue-600 font-medium">Drag & drop</span> or{' '}
                              <span className="text-blue-600 font-medium">click to browse</span>
                            </>
                          )}
                          . Supports JPG, PNG, WEBP. Max 5MB per image.
                        </p>
                        <button
                          type="button"
                          onClick={handleChooseImagesClick}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <TbFolderOpen className="w-5 h-5" />
                            Open File Browser
                          </div>
                        </button>
                        <p className="text-xs text-gray-500 mt-4">
                          Recommended size: 1200×800px
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Footer with Delete Button */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !isAdminOrSeller}
                className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl transition-all flex-1 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  !isAdminOrSeller 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-400'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl focus:ring-green-500'
                }`}
              >
                <TbCheck className="w-6 h-6" />
                {isSubmitting ? 'Updating Appliance...' : 'Update Appliance'}
              </button>
              
              {/* Delete Button (only for Admin/Seller) */}
              {isAdminOrSeller && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <TbTrash className="w-6 h-6" />
                  {isDeleting ? 'Deleting...' : 'Delete Product'}
                </button>
              )}
              
              <button
                type="button"
                onClick={() => navigate(`/product/${id}`)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <TbX className="w-6 h-6" />
                Cancel
              </button>
            </div>
            
            {!isAdminOrSeller && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-center font-medium">
                  ⚠️ Admin or Seller privileges required to make changes
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TbTrash className="w-10 h-10 text-red-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Delete Product?
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">{formData.title}</span>? 
                  This action cannot be undone and all product data will be permanently removed.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDeleteProduct}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-6">
                  Note: This will permanently remove the product from your store.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Product Status</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formData.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            <p className="text-sm text-gray-600 mt-1">{formData.stock} units available</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
            <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide">Current Price</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">${formData.price.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">Excluding taxes</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Customer Rating</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-bold text-gray-900">{formData.rating.toFixed(1)}</span>
              <span className="text-gray-500">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;