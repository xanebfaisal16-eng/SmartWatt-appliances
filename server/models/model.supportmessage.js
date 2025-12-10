// server/models/SupportMessage.model.js
import mongoose from 'mongoose';

const supportMessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['account', 'orders', 'technical', 'general'], 
        default: 'general' 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    },
    status: { 
        type: String, 
        enum: ['pending', 'in progress', 'resolved', 'closed'], 
        default: 'pending' 
    },
    response: String,
    responseTime: Date,
    resolved: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    archivedAt: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

export default mongoose.model('SupportMessage', supportMessageSchema);
