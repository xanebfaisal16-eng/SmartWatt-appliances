const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Add index for faster queries
    },
    orderNumber: { // Add unique order number for customer reference
        type: String,
        unique: true,
        default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        name: String,
        image: String,
        // Optional: Add discount per item if needed
        discount: {
            type: Number,
            default: 0,
            min: 0
        }
    }],
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        country: {
            type: String,
            default: 'USA' // Default if not specified
        },
        zipCode: String,
        phone: String,
        recipientName: String // Add recipient name
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'paypal', 'bank_transfer'],
        default: 'card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    shippingFee: {
        type: Number,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    discount: { // Add order-level discount
        type: Number,
        default: 0,
        min: 0
    },
    trackingNumber: String,
    notes: String,
    estimatedDelivery: Date, // Add estimated delivery date
    deliveredAt: Date // Actual delivery timestamp
}, {
    timestamps: true
});

// Add indexes for common queries
OrderSchema.index({ user: 1, createdAt: -1 }); // User's order history
OrderSchema.index({ status: 1 }); // Filter by status
OrderSchema.index({ 'paymentStatus': 1 }); // Payment queries

export default mongoose.model('Order', OrderSchema);