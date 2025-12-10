// middlewares/requireAdmin.js
export const requireAdmin = (req, res, next) => {
    // req.user comes from requireLoggedIn middleware
    if (req.user && req.user.role) {
        // role can be an array or string depending on your signup setup
        const roles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
        if (roles.includes('admin')) {
            return next(); // user is admin, allow access
        }
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};
