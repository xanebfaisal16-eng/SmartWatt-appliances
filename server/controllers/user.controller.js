import User from "../models/model.users.js";
import bcrypt from "bcryptjs";
import validator from "email-validator";
import jwt from "jsonwebtoken";
import passwordValidator from "password-validator";
import { JWT_SECRET } from "../config/config.js";

// ======================= PASSWORD VALIDATION =======================
const pwd_schema = new passwordValidator();
pwd_schema
  .is().min(8)
  .is().max(40)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().symbols(2)
  .is().not().oneOf(["Passw0rd", "Password5646", ""]);

// ======================= JWT TOKEN =======================
const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "15d" }
  );
};

// ======================= DASHBOARD STATS =======================
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    // 1. Get wishlist count from user data
    const wishlistCount = user.wishlist ? user.wishlist.length : 0;
    
    // 2. Calculate account age in days
    const accountAge = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // 3. Prepare recent activities
    const recentActivities = [
      {
        id: 'user-joined',
        icon: 'user',
        title: 'Account Created',
        description: `Joined ${accountAge} day${accountAge !== 1 ? 's' : ''} ago`,
        time: 'Member since',
        status: 'info'
      }
    ];

    // Add wishlist activity if there are items
    if (wishlistCount > 0) {
      recentActivities.unshift({
        id: 'wishlist-items',
        icon: 'heart',
        title: 'Wishlist Updated',
        description: `${wishlistCount} item${wishlistCount !== 1 ? 's' : ''} saved`,
        time: 'Recently',
        status: 'success'
      });
    }

    // 4. Check for admin role to add admin-specific stats
    const isAdmin = user.role === 'admin';
    
    // Default stats (you can add Order/Product models later)
    const stats = {
      wishlistCount,
      totalOrders: 0, // Add your Order model logic here
      pendingOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      recentActivities,
      userRole: user.role,
      isVerified: user.isVerified || false,
      memberSince: user.createdAt,
      accountAge: accountAge
    };

    // 5. If admin, you can add admin-specific data here
    if (isAdmin) {
      try {
        // Add admin stats if needed
        const totalUsers = await User.countDocuments();
        stats.totalUsers = totalUsers;
        
        // Add to recent activities
        recentActivities.unshift({
          id: 'admin-stats',
          icon: 'shield',
          title: 'Admin Overview',
          description: `${totalUsers} total users in system`,
          time: 'Now',
          status: 'admin'
        });
      } catch (adminError) {
        console.log("Admin stats error:", adminError.message);
      }
    }

    return res.json({
      success: true,
      stats: stats
    });

  } catch (err) {
    console.error("getDashboardStats Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      error: "Failed to load dashboard stats",
      message: err.message 
    });
  }
};

// ======================= EXPORT USER DATA =======================
const exportData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user data
    const userData = await User.findById(userId).lean();
    
    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    // Remove sensitive data
    delete userData.password;
    delete userData.__v;
    
    // Get orders if you have Order model
    let orders = [];
    try {
      // If you have Order model imported, uncomment this:
      // const Order = require("../models/order.model.js");
      // orders = await Order.find({ user: userId }).lean();
    } catch (orderError) {
      console.log("Orders not available for export:", orderError.message);
    }

    // Prepare export data
    const exportData = {
      userProfile: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        phone: userData.mobile_number,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        zipCode: userData.zipCode,
        gender: userData.gender,
        dateOfBirth: userData.dob,
        role: userData.role,
        isVerified: userData.isVerified,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      },
      preferences: {
        // Add user preferences here if you have them
        newsletter: true,
        notifications: true
      },
      orders: orders,
      statistics: {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        accountAge: Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      },
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportFormat: "JSON",
        dataVersion: "1.0"
      }
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}-${Date.now()}.json"`);
    
    // Send formatted JSON
    res.send(JSON.stringify(exportData, null, 2));

  } catch (err) {
    console.error("Export data error:", err.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to export user data",
      message: err.message 
    });
  }
};

// ======================= DELETE ACCOUNT =======================
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { confirmation, reason } = req.body;

    // Validate confirmation
    if (!confirmation || confirmation !== 'DELETE') {
      return res.status(400).json({
        success: false,
        error: "Confirmation required. Send 'DELETE' in confirmation field."
      });
    }

    // Get user before deletion (optional for logging)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Optional: Log deletion reason
    console.log(`Account deletion requested for user: ${user.email}, Reason: ${reason || 'Not specified'}`);

    // Delete user from database
    await User.findByIdAndDelete(userId);

    // Optional: Delete associated data
    try {
      // Delete orders if you have Order model
      // const Order = require("../models/order.model.js");
      // await Order.deleteMany({ user: userId });
      // console.log(`Deleted orders for user: ${user.email}`);
      
      // Delete wishlist items (handled by user deletion due to reference)
      // Delete cart items if you have Cart model
      // if (typeof Cart !== 'undefined') {
      //   await Cart.deleteMany({ user: userId });
      // }
      
    } catch (dataError) {
      console.log("Note: Some associated data could not be deleted:", dataError.message);
    }

    // Return success response
    res.json({
      success: true,
      message: "Account deleted successfully",
      details: {
        userId: userId,
        email: user.email,
        deletedAt: new Date().toISOString(),
        dataRemoved: true
      }
    });

  } catch (err) {
    console.error("Delete account error:", err.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to delete account",
      message: err.message 
    });
  }
};

// ======================= SIGNUP =======================
const signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    if (!email || !password) {
      return res.json({ success: false, error: "Email and password are required." });
    }

    if (!validator.validate(email)) {
      return res.json({ success: false, error: "Invalid email format." });
    }

    if (!pwd_schema.validate(password)) {
      return res.json({
        success: false,
        error:
          "Password must be 8-40 chars with 1 uppercase, 1 digit, and 2 special characters.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, error: "Email already registered." });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    // Only allow admin role if explicitly set (for security, usually manual creation)
    const userRole = role === "admin" ? "admin" : "user";

    const name = `${first_name || ""} ${last_name || ""}`.trim();

    const newUser = new User({
      first_name,
      last_name,
      name,
      email,
      password: hashPassword,
      role: userRole,
    });

    await newUser.save();

    const token = generateToken(newUser);

    return res.json({
      success: true,
      message: "Account successfully created!",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.log("Signup Error:", err.message);
    return res.json({ success: false, error: "Unable to create account." });
  }
};

// ======================= LOGIN =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, error: "Email and password are required." });
    }

    if (!validator.validate(email)) {
      return res.json({ success: false, error: "Invalid email format." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, error: "No account found with these credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, error: "Incorrect password." });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email,
        role: user.role, // ✅ Correct role
        isVerified: true,
      },
    });
  } catch (err) {
    console.log("Login Error:", err.message);
    return res.json({ success: false, error: "Login process encountered an error." });
  }
};

// ======================= FETCH LOGGED USER =======================
const fetchLoggedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.json({ success: false, error: "User not found." });

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email,
        role: user.role,
        isVerified: true,
      },
    });
  } catch (err) {
    console.log("FetchLoggedUser Error:", err.message);
    return res.json({ success: false, error: "Unable to retrieve user profile." });
  }
};

// ======================= GET USER PROFILE =======================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    delete user.password;

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User",
        email: user.email,
        role: user.role,
        membership: user.role === "admin" ? "Administrator" : "Premium User",
        avatar: user.profile_picture,
        phone: user.mobile_number,
        address: user.adress,
        city: user.city,
        state: user.state,
        country: user.country,
        zipCode: user.zipCode,
        gender: user.gender,
        dob: user.dob,
        status: "Active",
        wishlist: user.wishlist || [], // Make sure this is included
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
    });
  } catch (err) {
    console.log("getUserProfile Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================= UPDATE PROFILE =======================
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true }
    );

    if (!updatedUser) return res.json({ success: false, message: "User not found." });

    return res.json({ success: true, message: "Profile updated successfully!", user: updatedUser });
  } catch (err) {
    console.log("updateProfile Error:", err.message);
    return res.json({ success: false, message: "Unable to update profile." });
  }
};

// ======================= ADMIN MIDDLEWARE =======================
export const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ success: false, message: "Not authorized. Please login again." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admin only." });
  }

  next();
};

// ======================= ADMIN ROUTES =======================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    return res.json({ success: true, users, count: users.length });
  } catch (err) {
    console.log("getAllUsers Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    return res.json({ success: true, stats: { totalUsers } });
  } catch (err) {
    console.log("getAdminStats Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================= EXPORT =======================
export {
  signup,
  login,
  fetchLoggedUser,
  getUserProfile,
  updateProfile,
  getAllUsers,
  getAdminStats,
  getDashboardStats,
  exportData,      // Add this
  deleteAccount    // Add this
};