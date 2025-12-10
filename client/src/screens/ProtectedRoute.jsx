// src/screens/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, hasRole } from '../utils/auth';

const ProtectedRoute = ({ children, requireAuth = true, requiredRole, requireAdmin = false }) => {
    const isAuth = isAuthenticated();
    
    // If auth is required but user is not authenticated
    if (requireAuth && !isAuth) {
        return <Navigate to="/login" replace />;
    }
    
    // If admin is required but user is not admin
    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }
    
    // If specific role is required
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

export default ProtectedRoute;