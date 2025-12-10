import mongoose, { Schema, model } from 'mongoose';

const ratingSchema = new Schema({
    // Product Reference
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
        index: true
    },
    
    // User Reference
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    
    // Rating (1-5 stars)
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Minimum rating is 1 star'],
        max: [5, 'Maximum rating is 5 stars'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be a whole number'
        }
    },
    
    // Review Title
    title: {
        type: String,
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    
    // Review Comment
    comment: {
        type: String,
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    
    // Verified Purchase Badge
    verifiedPurchase: {
        type: Boolean,
        default: false
    },
    
    // Helpful Votes
    helpful: {
        type: Number,
        default: 0
    },
    
    // Users who found this helpful
    helpfulVotes: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Review Images
    images: [{
        url: String,
        publicId: String,
        caption: String
    }],
    
    // Review Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    
    // Moderator Notes (for admin)
    moderatorNotes: String
    
}, {
    timestamps: true
});

// ============ INDEXES ============

// Prevent duplicate ratings from same user on same product
ratingSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Index for sorting
ratingSchema.index({ createdAt: -1 });
ratingSchema.index({ helpful: -1 });
ratingSchema.index({ rating: -1 });

// ============ MIDDLEWARE ============

// AUTO-UPDATE PRODUCT RATING WHEN REVIEW IS SAVED
ratingSchema.post('save', async function(doc) {
    try {
        const Product = mongoose.model('Product');
        await Product.updateProductRating(doc.productId);
    } catch (error) {
        console.error('Error updating product rating after save:', error);
    }
});

// AUTO-UPDATE PRODUCT RATING WHEN REVIEW IS DELETED
ratingSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        try {
            const Product = mongoose.model('Product');
            await Product.updateProductRating(doc.productId);
        } catch (error) {
            console.error('Error updating product rating after delete:', error);
        }
    }
});

ratingSchema.post('deleteOne', async function(doc) {
    if (doc) {
        try {
            const Product = mongoose.model('Product');
            await Product.updateProductRating(doc.productId);
        } catch (error) {
            console.error('Error updating product rating after delete:', error);
        }
    }
});

// ============ STATIC METHODS ============

// Get rating summary for a product
ratingSchema.statics.getRatingSummary = async function(productId) {
    try {
        const result = await this.aggregate([
            // Match ratings for this product
            { $match: { 
                productId: new mongoose.Types.ObjectId(productId),
                status: 'approved'
            }},
            
            // Group to calculate stats
            { $group: {
                _id: '$productId',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
                ratingDistribution: { $push: '$rating' }
            }},
            
            // Format the output
            { $project: {
                averageRating: { $round: ['$averageRating', 1] },
                totalReviews: 1,
                ratingBreakdown: {
                    5: { 
                        $size: { 
                            $filter: {
                                input: '$ratingDistribution',
                                as: 'rating',
                                cond: { $eq: ['$$rating', 5] }
                            }
                        }
                    },
                    4: { 
                        $size: { 
                            $filter: {
                                input: '$ratingDistribution',
                                as: 'rating',
                                cond: { $eq: ['$$rating', 4] }
                            }
                        }
                    },
                    3: { 
                        $size: { 
                            $filter: {
                                input: '$ratingDistribution',
                                as: 'rating',
                                cond: { $eq: ['$$rating', 3] }
                            }
                        }
                    },
                    2: { 
                        $size: { 
                            $filter: {
                                input: '$ratingDistribution',
                                as: 'rating',
                                cond: { $eq: ['$$rating', 2] }
                            }
                        }
                    },
                    1: { 
                        $size: { 
                            $filter: {
                                input: '$ratingDistribution',
                                as: 'rating',
                                cond: { $eq: ['$$rating', 1] }
                            }
                        }
                    }
                }
            }}
        ]);

        // Return summary or default values
        return result[0] || {
            averageRating: 0,
            totalReviews: 0,
            ratingBreakdown: {5:0,4:0,3:0,2:0,1:0}
        };
        
    } catch (error) {
        console.error('Error getting rating summary:', error);
        throw error;
    }
};

// Check if user already rated a product
ratingSchema.statics.hasUserRated = async function(productId, userId) {
    const existingRating = await this.findOne({
        productId: productId,
        userId: userId
    });
    return !!existingRating;
};

// Get user's rating for a product
ratingSchema.statics.getUserRating = async function(productId, userId) {
    return await this.findOne({
        productId: productId,
        userId: userId
    });
};

// ============ INSTANCE METHODS ============

// Check if user can vote helpful (not their own review, not already voted)
ratingSchema.methods.canVoteHelpful = function(userId) {
    // Can't vote on your own review
    if (this.userId.toString() === userId.toString()) {
        return false;
    }
    
    // Check if user already voted
    const alreadyVoted = this.helpfulVotes.some(vote => 
        vote.userId.toString() === userId.toString()
    );
    
    return !alreadyVoted;
};

// Add helpful vote
ratingSchema.methods.addHelpfulVote = function(userId) {
    if (this.canVoteHelpful(userId)) {
        this.helpfulVotes.push({
            userId: userId,
            votedAt: new Date()
        });
        this.helpful += 1;
        return true;
    }
    return false;
};

// Format for response (hide sensitive info)
ratingSchema.methods.toJSON = function() {
    const obj = this.toObject();
    
    // Remove helpfulVotes array from response
    delete obj.helpfulVotes;
    delete obj.moderatorNotes;
    
    return obj;
};

// ============ CREATE MODEL ============

const Rating = model('Rating', ratingSchema);
export default Rating;