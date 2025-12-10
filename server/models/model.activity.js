import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['login', 'order', 'profile_update', 'review', 'purchase', 'system', 'welcome'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
    status: {
        type: String,
        enum: ['success', 'info', 'warning', 'error'],
        default: 'info'
    }
}, {
    timestamps: true
});

ActivitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Activity', ActivitySchema);