import mongoose, { model, Schema } from 'mongoose'

const productSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    subtitle: {
        type: String,
        require: true
    },
    brand: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    rating: {
        type: Number,
        default: 0
    },
    // REMOVE THIS: reviews: [reviewSchema],
    images: [],
    numberofReviews: {
        type: Number,
        default: 0
    },
    dimension: {},
    sku: {
        type: String,
        default: ''
    },
    asn: {
        type: String,
        default: ''
    },
    discount: {
        type: Number,
        default: 0
    },
    onSale: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Product = model("product", productSchema);
export default Product;