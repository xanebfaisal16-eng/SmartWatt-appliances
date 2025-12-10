// import jwt from 'jsonwebtoken';
// import User from '../models/model.users.js';
// import { JWT_SECRET } from "../config/config.js";

// // 1. AUTHENTICATE - Verify JWT token
// export const authenticate = async (req, res, next) => {
//     try {
//         // Get token from Authorization header
//         const authHeader = req.headers.authorization;
        
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'No token provided. Please login first.' 
//             });
//         }

//         const token = authHeader.split(' ')[1];
        
//         // Verify token
//         const decoded = jwt.verify(token, JWT_SECRET);
        
//         // Find user without password
//         const user = await User.findById(decoded._id).select('-password');
        
//         if (!user) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'User not found. Token invalid.' 
//             });
//         }

//         // Attach user to request
//         req.user = user;
//         next();
        
//     } catch (error) {
//         console.log('Authentication Error:', error.message);
        
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Invalid token. Please login again.' 
//             });
//         }
        
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Token expired. Please login again.' 
//             });
//         }
        
//         return res.status(401).json({ 
//             success: false, 
//             message: 'Authentication failed.' 
//         });
//     }
// };

// // 2. IS ADMIN - Check if user is admin
// export const isAdmin = (req, res, next) => {
//     if (!req.user) {
//         return res.status(401).json({ 
//             success: false, 
//             message: 'Authentication required.' 
//         });
//     }

//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ 
//             success: false, 
//             message: 'Admin access required.' 
//         });
//     }
    
//     next();
// };

// // 3. IS ADMIN OR SELLER - Check if user is admin or seller
// export const isAdminOrSeller = (req, res, next) => {
//     if (!req.user) {
//         return res.status(401).json({ 
//             success: false, 
//             message: 'Authentication required.' 
//         });
//     }

//     if (!['admin', 'seller'].includes(req.user.role)) {
//         return res.status(403).json({ 
//             success: false, 
//             message: 'Admin or Seller access required.' 
//         });
//     }
    
//     next();
// };

// // 4. IS SELLER - Check if user is seller
// export const isSeller = (req, res, next) => {
//     if (!req.user) {
//         return res.status(401).json({ 
//             success: false, 
//             message: 'Authentication required.' 
//         });
//     }

//     if (req.user.role !== 'seller') {
//         return res.status(403).json({ 
//             success: false, 
//             message: 'Seller access required.' 
//         });
//     }
    
//     next();
// };