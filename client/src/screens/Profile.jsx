// screens/Profile.jsx - WORKING LOCAL VERSION
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiSave, FiX, FiUpload, FiCamera } from 'react-icons/fi';

const Profile = () => {
  // Initialize with user data from localStorage or defaults
  const getUserData = () => {
    const name = localStorage.getItem('userName') || 'Bilal Fasial';
    const email = localStorage.getItem('userEmail') || 'BilalFasisal67@gmail.com';
    const phone = localStorage.getItem('userPhone') || '+1 234 567 8900';
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
    
    return {
      name,
      email,
      phone,
      createdAt: 'January 2024',
      profilePic: localStorage.getItem('profilePic') || avatar
    };
  };

  const [user, setUser] = useState(getUserData());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(getUserData());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user.profilePic);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load data on component mount
    const data = getUserData();
    setUser(data);
    setEditForm(data);
    setImagePreview(data.profilePic);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setProfileImage(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setEditForm({ ...editForm, profilePic: previewUrl });
    
    setError('');
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
    setImagePreview(defaultAvatar);
    setEditForm({ ...editForm, profilePic: defaultAvatar });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleSave = () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Save to localStorage
      localStorage.setItem('userName', editForm.name);
      localStorage.setItem('userPhone', editForm.phone);
      
      // Save profile picture if uploaded
      if (profileImage) {
        // Convert image to base64 for localStorage
        const reader = new FileReader();
        reader.onloadend = () => {
          localStorage.setItem('profilePic', reader.result);
          
          // Update user state with new data
          const updatedUser = {
            ...user,
            name: editForm.name,
            phone: editForm.phone,
            profilePic: reader.result
          };
          
          setUser(updatedUser);
          setImagePreview(reader.result);
          
          // Cleanup blob URL if exists
          if (imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
          }
          
          setSuccess('Profile updated successfully with new image!');
          setIsEditing(false);
          setProfileImage(null);
          setSaving(false);
        };
        reader.readAsDataURL(profileImage);
      } else {
        // Update without new image
        const updatedUser = {
          ...user,
          name: editForm.name,
          phone: editForm.phone,
          profilePic: editForm.profilePic
        };
        
        setUser(updatedUser);
        
        // Save existing profile pic
        if (editForm.profilePic && !editForm.profilePic.includes('api.dicebear')) {
          localStorage.setItem('profilePic', editForm.profilePic);
        }
        
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setProfileImage(null);
        setSaving(false);
      }
      
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save changes. Please try again.');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
    setError('');
    setSuccess('');
    setProfileImage(null);
    
    // Reset image preview to current user image
    setImagePreview(user.profilePic);
    
    // Cleanup blob URL if exists
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div>
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-300">Manage your personal information and profile picture</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-800/50 rounded-xl">
          <p className="text-green-400">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture Section */}
              <div className="relative group">
                <img 
                  src={isEditing ? imagePreview : user.profilePic} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                  onError={(e) => {
                    // Fallback to default avatar
                    e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
                  }}
                />
                
                {isEditing && (
                  <>
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {/* Upload overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                         onClick={handleUploadClick}
                    >
                      <FiCamera className="text-white text-xl" />
                    </div>
                    
                    {/* Upload button */}
                    <button 
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg border-2 border-gray-900"
                      onClick={handleUploadClick}
                      type="button"
                      title="Upload Profile Picture"
                    >
                      <FiUpload className="text-white text-sm" />
                    </button>
                    
                    {/* Remove button if new image selected */}
                    {profileImage && (
                      <button 
                        className="absolute -bottom-2 -right-16 w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg border-2 border-gray-900"
                        onClick={handleRemoveImage}
                        type="button"
                        title="Remove Selected Image"
                      >
                        <FiX className="text-white text-sm" />
                      </button>
                    )}
                  </>
                )}
              </div>
              
              {/* Profile Information */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Upload Instructions */}
                    {isEditing && (
                      <div className="mb-2 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                        <p className="text-sm text-blue-300">
                          <FiCamera className="inline mr-2" />
                          Click on your profile picture to upload a new one
                        </p>
                        <p className="text-xs text-blue-400/80 mt-1">
                          Supported: JPG, PNG, GIF, WebP • Max 5MB
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <FiUser />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <FiMail />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        disabled
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <FiPhone />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition flex items-center gap-2"
                      >
                        <FiX />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <FiMail className="text-gray-400" />
                        <div>
                          <p className="text-gray-300">{user.email}</p>
                          <p className="text-gray-500 text-sm">Email Address</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <FiPhone className="text-gray-400" />
                        <div>
                          <p className="text-gray-300">{user.phone || 'Not provided'}</p>
                          <p className="text-gray-500 text-sm">Phone Number</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <FiCalendar className="text-gray-400" />
                        <div>
                          <p className="text-gray-300">Member since {user.createdAt}</p>
                          <p className="text-gray-500 text-sm">Account Created</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition flex items-center gap-2"
                      >
                        <FiEdit2 />
                        Edit Profile
                      </button>
                      
                      <Link 
                        to="/dashboard/settings"
                        className="px-5 py-2.5 border border-gray-600 hover:bg-gray-700 rounded-lg font-medium transition flex items-center gap-2"
                      >
                        Account Settings
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Account Details */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <h3 className="font-bold text-lg mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Account Type</span>
                <span className="font-medium text-green-400">Premium User</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email Verified</span>
                <span className="text-green-400 font-medium">Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Profile Picture</span>
                <span className={`font-medium ${user.profilePic && !user.profilePic.includes('dicebear') ? 'text-green-400' : 'text-yellow-400'}`}>
                  {user.profilePic && !user.profilePic.includes('dicebear') ? 'Uploaded' : 'Default Avatar'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Picture Tips */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-800/30">
            <h3 className="font-bold text-lg mb-3 text-purple-300">Profile Picture Tips</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">📷</span>
                <span className="text-gray-300">Use a clear, recent photo of yourself</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">✨</span>
                <span className="text-gray-300">Good lighting works best</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">🖼️</span>
                <span className="text-gray-300">Square images work better</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">⚡</span>
                <span className="text-gray-300">Max file size: 5MB</span>
              </li>
            </ul>
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full mt-4 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-sm transition flex items-center justify-center gap-2"
            >
              <FiUpload />
              Upload Profile Picture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;