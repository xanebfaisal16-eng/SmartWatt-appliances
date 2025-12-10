// middlewares/decodeToken.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

export const requireLoggedIn = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded; // decoded contains _id, email, role
        next();
    } catch (err) {
        console.log('JWT Error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
