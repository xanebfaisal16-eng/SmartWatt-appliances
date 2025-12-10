import express from 'express';
import Rating from '../models/model.rating.js';
import Product from '../models/model.products.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';
// or whatever functions you actually need

const router = express.Router();

// ============ PUBLIC ROUTES ============

// @desc    Get all ratings for a product
// @route   GET /api/ratings/product/:productId
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sort = 'newest', rating } = req.query;
        
        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Build query
        let query = { productId, status: 'approved' };
        
        // Filter by rating if provided
        if (rating && [1,2,3,4,5].includes(parseInt(rating))) {
            query.rating = parseInt(rating);
        }
        
        // Sort options
        let sortOption = {};
        switch(sort) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'helpful':
                sortOption = { helpful: -1, createdAt: -1 };
                break;
            case 'highest':
                sortOption = { rating: -1, createdAt: -1 };
                break;
            case 'lowest':
                sortOption = { rating: 1, createdAt: -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }
        
        // Execute query with pagination
        const ratings = await Rating.find(query)
            .populate('user', 'name email avatar')
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        // Get total count for pagination
        const total = await Rating.countDocuments(query);
        
        // Get rating summary
        const summary = await Rating.getRatingSummary(productId);
        
        res.json({
            success: true,
            count: ratings.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            summary,
            ratings
        });
        
    } catch (error) {
        console.error('Get ratings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get rating summary for a product
// @route   GET /api/ratings/summary/:productId
// @access  Public
router.get('/summary/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const summary = await Rating.getRatingSummary(productId);
        
        res.json({
            success: true,
            summary
        });
        
    } catch (error) {
        console.error('Get rating summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// ============ PROTECTED ROUTES (Require Login) ============

// @desc    Submit a rating/review
// @route   POST /api/ratings
// @access  Private
router.post('/', authenticate, async (req, res) => {
    try {
        const { productId, rating, title, comment, images } = req.body;
        
        // Validation
        if (!productId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and rating are required'
            });
        }
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }
        
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Check if user already rated this product
        const existingRating = await Rating.findOne({
            productId,
            userId: req.user.id
        });
        
        if (existingRating) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }
        
        // Check if user purchased this product (for verified purchase badge)
        // You need to implement this based on your Order model
        const hasPurchased = false; // Implement your purchase check here
        
        // Create new rating
        const newRating = new Rating({
            productId,
            userId: req.user.id,
            rating,
            title: title || '',
            comment: comment || '',
            verifiedPurchase: hasPurchased,
            images: images || [],
            status: 'approved' // Auto-approve for now, can be 'pending' for moderation
        });
        
        await newRating.save();
        
        // Populate user info for response
        await newRating.populate('user', 'name email avatar');
        
        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            rating: newRating
        });
        
    } catch (error) {
        console.error('Submit rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Update user's own rating
// @route   PUT /api/ratings/:id
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { rating, title, comment, images } = req.body;
        
        // Find the rating
        let userRating = await Rating.findById(req.params.id);
        
        if (!userRating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found'
            });
        }
        
        // Check ownership
        if (userRating.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }
        
        // Update rating
        userRating.rating = rating || userRating.rating;
        userRating.title = title || userRating.title;
        userRating.comment = comment || userRating.comment;
        userRating.images = images || userRating.images;
        
        await userRating.save();
        
        // Populate user info
        await userRating.populate('user', 'name email avatar');
        
        res.json({
            success: true,
            message: 'Review updated successfully',
            rating: userRating
        });
        
    } catch (error) {
        console.error('Update rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Delete user's own rating
// @route   DELETE /api/ratings/:id
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
    try {
        // Find the rating
        const rating = await Rating.findById(req.params.id);
        
        if (!rating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found'
            });
        }
        
        // Check ownership
        if (rating.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }
        
        // Store productId before deletion
        const productId = rating.productId;
        
        // Delete the rating
        await rating.deleteOne();
        
        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Mark review as helpful
// @route   PUT /api/ratings/:id/helpful
// @access  Private
router.put('/:id/helpful', authenticate, async (req, res) => {
    try {
        // Find the rating
        const rating = await Rating.findById(req.params.id);
        
        if (!rating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found'
            });
        }
        
        // Check if user can vote (not their own review)
        if (rating.userId.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot vote on your own review'
            });
        }
        
        // Add helpful vote
        const voted = rating.addHelpfulVote(req.user.id);
        
        if (!voted) {
            return res.status(400).json({
                success: false,
                message: 'You have already voted on this review'
            });
        }
        
        await rating.save();
        
        res.json({
            success: true,
            message: 'Thank you for your feedback',
            helpfulCount: rating.helpful
        });
        
    } catch (error) {
        console.error('Helpful vote error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get user's ratings
// @route   GET /api/ratings/my-ratings
// @access  Private
router.get('/my-ratings', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        const ratings = await Rating.find({ userId: req.user.id })
            .populate('productId', 'title price images')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Rating.countDocuments({ userId: req.user.id });
        
        res.json({
            success: true,
            count: ratings.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            ratings
        });
        
    } catch (error) {
        console.error('Get user ratings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// ============ ADMIN ROUTES ============

// @desc    Get all ratings (admin)
// @route   GET /api/ratings/admin/all
// @access  Private/Admin
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        
        let query = {};
        if (status) query.status = status;
        
        const ratings = await Rating.find(query)
            .populate('productId', 'title')
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Rating.countDocuments(query);
        
        res.json({
            success: true,
            count: ratings.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            ratings
        });
        
    } catch (error) {
        console.error('Admin get ratings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Update rating status (admin moderation)
// @route   PUT /api/ratings/admin/:id/status
// @access  Private/Admin
router.put('/admin/:id/status', authenticate, isAdmin, async (req, res) => {
    try {
        const { status, moderatorNotes } = req.body;
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        const rating = await Rating.findByIdAndUpdate(
            req.params.id,
            {
                status,
                moderatorNotes
            },
            { new: true }
        ).populate('productId', 'title').populate('user', 'name email');
        
        if (!rating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found'
            });
        }
        
        res.json({
            success: true,
            message: `Review ${status} successfully`,
            rating
        });
        
    } catch (error) {
        console.error('Update rating status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Delete any rating (admin)
// @route   DELETE /api/ratings/admin/:id
// @access  Private/Admin
router.delete('/admin/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id);
        
        if (!rating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found'
            });
        }
        
        await rating.deleteOne();
        
        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
        
    } catch (error) {
        console.error('Admin delete rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

export default router;