// routes/admin.routes.js
import express from 'express';
const router = express.Router();

// ========== SIMPLE AUTH MIDDLEWARE ==========
// Add these inline functions to avoid import issues
const verifyToken = (req, res, next) => {
    console.log('🔐 Admin route - Token verification (simplified)');
    // For now, just add a dummy user object
    req.user = {
        _id: 'admin_dummy_id_123',
        email: 'admin@example.com',
        role: ['admin'], // Default to admin for testing
        name: 'Admin User'
    };
    next();
};

const authorize = (allowedRoles) => {
    return (req, res, next) => {
        console.log(`🔐 Admin route - Authorizing for roles: ${allowedRoles}`);
        
        const userRole = req.user.role;
        const userRoles = Array.isArray(userRole) ? userRole : [userRole];
        const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        // Check if user has any of the allowed roles
        const hasPermission = userRoles.some(role => 
            allowedRolesArray.includes(role)
        );

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.',
                requiredRoles: allowedRolesArray,
                yourRole: userRole
            });
        }

        next();
    };
};

// ========== ADMIN ONLY ROUTES ==========

// 1. Get all users (admin only)
router.get('/users', verifyToken, authorize(['admin']), async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Admin accessed all users',
            data: [
                { id: 1, email: 'user1@test.com', role: 'buyer', name: 'User One' },
                { id: 2, email: 'user2@test.com', role: 'seller', name: 'User Two' },
                { id: 3, email: 'admin@test.com', role: 'admin', name: 'Admin User' }
            ],
            user: req.user // Shows who made the request
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users'
        });
    }
});

// 2. Get all orders (admin only)
router.get('/orders', verifyToken, authorize(['admin']), async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Admin accessed all orders',
            data: [
                { orderId: 'ORD001', amount: 100, status: 'completed', customer: 'User One' },
                { orderId: 'ORD002', amount: 200, status: 'pending', customer: 'User Two' },
                { orderId: 'ORD003', amount: 150, status: 'shipped', customer: 'User Three' }
            ],
            total: 3,
            revenue: 450
        });
    } catch (error) {
        console.error('Admin orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching orders'
        });
    }
});

// 3. Admin dashboard stats
router.get('/stats', verifyToken, authorize(['admin']), async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Admin dashboard statistics',
            stats: {
                totalUsers: 150,
                totalOrders: 45,
                totalRevenue: 5000,
                pendingOrders: 3,
                todayOrders: 5,
                monthlyRevenue: 2500,
                activeSellers: 12,
                newUsersThisMonth: 25
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching statistics'
        });
    }
});

// 4. Update user role (admin only)
router.put('/users/:userId/role', verifyToken, authorize(['admin']), async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        
        console.log(`Updating user ${userId} role to ${role}`);
        
        if (!['buyer', 'seller', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be: buyer, seller, or admin'
            });
        }
        
        // In real app: await User.findByIdAndUpdate(userId, { role })
        
        res.json({
            success: true,
            message: `User ${userId} role updated to ${role}`,
            data: {
                userId,
                oldRole: 'buyer', // Example
                newRole: role,
                updatedAt: new Date().toISOString(),
                updatedBy: req.user.email
            }
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating user role'
        });
    }
});

// 5. Block/Unblock user (admin only)
router.put('/users/:userId/block', verifyToken, authorize(['admin']), async (req, res) => {
    try {
        const { userId } = req.params;
        const { isBlocked } = req.body;
        
        console.log(`Setting block status for user ${userId}: ${isBlocked}`);
        
        // Prevent admin from blocking themselves
        if (userId === req.user._id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot block yourself'
            });
        }
        
        // In real app: await User.findByIdAndUpdate(userId, { isBlocked })
        
        const action = isBlocked ? 'blocked' : 'unblocked';
        res.json({
            success: true,
            message: `User ${userId} ${action}`,
            data: {
                userId,
                isBlocked,
                action,
                actionBy: req.user.email,
                actionTime: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error blocking/unblocking user'
        });
    }
});

// ========== SELLER ROUTES ==========

// 6. Seller can manage their products
router.get('/seller/products', verifyToken, authorize(['seller', 'admin']), async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Seller products accessed',
            data: [
                { 
                    productId: 'P001', 
                    name: 'Premium Widget', 
                    price: 50, 
                    stock: 100,
                    status: 'active',
                    createdAt: '2024-01-15'
                },
                { 
                    productId: 'P002', 
                    name: 'Super Gadget', 
                    price: 75, 
                    stock: 50,
                    status: 'active',
                    createdAt: '2024-01-20'
                }
            ],
            user: req.user,
            totalProducts: 2
        });
    } catch (error) {
        console.error('Seller products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching seller products'
        });
    }
});

// ========== BUYER ROUTES ==========

// 7. Buyer can view their orders (buyer + admin can view)
router.get('/buyer/orders', verifyToken, authorize(['buyer', 'admin']), async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Buyer orders accessed',
            data: [
                { 
                    orderId: 'MY001', 
                    product: 'Item A', 
                    status: 'shipped',
                    amount: 100,
                    orderDate: '2024-01-10',
                    trackingNumber: 'TRK123456'
                },
                { 
                    orderId: 'MY002', 
                    product: 'Item B', 
                    status: 'delivered',
                    amount: 200,
                    orderDate: '2024-01-05',
                    trackingNumber: 'TRK789012'
                }
            ],
            user: req.user,
            totalOrders: 2,
            totalSpent: 300
        });
    } catch (error) {
        console.error('Buyer orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching buyer orders'
        });
    }
});

// 8. Test admin endpoint (no auth for testing)
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Admin routes are working!',
        endpoints: {
            users: 'GET /api/v1/admin/users',
            orders: 'GET /api/v1/admin/orders',
            stats: 'GET /api/v1/admin/stats',
            sellerProducts: 'GET /api/v1/admin/seller/products',
            buyerOrders: 'GET /api/v1/admin/buyer/orders'
        },
        note: 'Use Authorization header with Bearer token for protected routes'
    });
});

export default router;