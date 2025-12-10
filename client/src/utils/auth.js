// src/utils/auth.js

// Save auth data from URL parameters (Google OAuth redirect)
export const saveAuthFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');
    const isAdmin = urlParams.get('isAdmin') === 'true';
    
    if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role || 'buyer');
        localStorage.setItem('isAdmin', isAdmin);
        
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
        
        return {
            token,
            role: role || 'buyer',
            isAdmin
        };
    }
    
    return null;
};

// Get current auth data
export const getAuthData = () => {
    return {
        token: localStorage.getItem('token'),
        role: localStorage.getItem('userRole') || 'buyer',
        isAdmin: localStorage.getItem('isAdmin') === 'true'
    };
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Check if user has specific role
export const hasRole = (requiredRole) => {
    const { role } = getAuthData();
    return role === requiredRole;
};

// Check if user is admin
export const isAdmin = () => {
    const { isAdmin, role } = getAuthData();
    return isAdmin || role === 'admin';
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    window.location.href = '/login';
};

// Get auth headers for API calls
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};