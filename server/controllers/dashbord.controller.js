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

    // 1. Get wishlist count
    const wishlistCount = user.wishlist ? user.wishlist.length : 0;

    // 2. Get order stats using your Order model
    let totalOrders = 0;
    let pendingOrders = 0;
    let totalRevenue = 0;
    
    try {
      // Import Order model at top: import Order from "../models/order.model.js";
      totalOrders = await Order.countDocuments({ user: userId });
      
      pendingOrders = await Order.countDocuments({ 
        user: userId, 
        status: { $in: ['pending', 'processing'] } 
      });
      
      // Get total revenue for this user
      const revenueResult = await Order.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId), status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]);
      
      totalRevenue = revenueResult[0]?.total || 0;
      
    } catch (orderError) {
      console.log("Order stats error:", orderError.message);
      // Use defaults if Order model not available
    }

    // 3. Get product stats (for admin only)
    let totalProducts = 0;
    if (user.role === 'admin') {
      try {
        // Import at top: import Product from "../models/product.model.js";
        totalProducts = await Product.countDocuments({});
      } catch (productError) {
        console.log("Product stats error:", productError.message);
      }
    }

    // 4. Recent activities
    const recentActivities = [
      {
        id: 'user-joined',
        icon: 'user',
        title: 'Account Created',
        description: `Member since ${new Date(user.createdAt).toLocaleDateString()}`,
        time: 'Joined',
        status: 'info'
      }
    ];

    // Add order activity if user has orders
    if (totalOrders > 0) {
      recentActivities.unshift({
        id: 'order-stats',
        icon: 'shopping-bag',
        title: 'Order Summary',
        description: `${totalOrders} total order${totalOrders !== 1 ? 's' : ''} (${pendingOrders} pending)`,
        time: 'Recently',
        status: pendingOrders > 0 ? 'warning' : 'success'
      });
    }

    // Add wishlist activity
    if (wishlistCount > 0) {
      recentActivities.unshift({
        id: 'wishlist-items',
        icon: 'heart',
        title: 'Wishlist',
        description: `${wishlistCount} item${wishlistCount !== 1 ? 's' : ''} saved`,
        time: 'Updated',
        status: 'success'
      });
    }

    // 5. Prepare stats response
    const stats = {
      wishlistCount,
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalProducts,
      recentActivities,
      userRole: user.role,
      isVerified: user.isVerified || false,
      memberSince: user.createdAt,
      accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    };

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