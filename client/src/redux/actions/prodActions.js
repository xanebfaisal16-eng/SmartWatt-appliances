import axios from "axios";
import apis from "../../config/config";
import {
  setLoading,
  setProducts,
  setProduct,
  removeProductFromList,
  setError,
  clearCurrentProduct
} from "../slices/prodSlice";

// ============================================
// Helper: Get user info from localStorage
// ============================================
const getUserInfo = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("❌ Error parsing user:", error);
    return null;
  }
};

// ============================================
// Helper: Check if user is Admin OR Seller
// ============================================
const isAdminOrSeller = (user) => {
  if (!user) return false;
  const role = user.role?.toLowerCase();
  return role === 'admin' || role === 'seller';
};

// ============================================
// ACTION: Fetch All Products
// ============================================
export const fetchProducts = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const { data } = await axios.get(apis.prod);
    
    if (data.ok) {
      dispatch(setProducts(data.products || []));
    } else {
      throw new Error(data.error || 'Failed to fetch products');
    }
  } catch (err) {
    console.error("❌ Fetch products error:", err.message);
    dispatch(setError(err.message));
  }
};

// ============================================
// ACTION: Fetch Single Product by ID
// ============================================
export const fetchProduct = (id) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const { data } = await axios.get(`${apis.prod}/${id}`);
    
    if (data.ok && data.product) {
      dispatch(setProduct(data.product));
    } else {
      throw new Error(data.error || 'Product not found');
    }
  } catch (err) {
    console.error("❌ Fetch product error:", err.message);
    dispatch(setError(err.message));
  }
};

// ============================================
// ACTION: Delete Product (ADMIN OR SELLER) - THIS IS EXPORTED
// ============================================
export const deleteProduct = (productId) => async (dispatch) => {
  try {
    console.log("🗑️ Deleting product ID:", productId);
    
    // Get user and token
    const user = getUserInfo();
    const token = localStorage.getItem('token');
    
    // Check if user has permission
    if (!isAdminOrSeller(user)) {
      throw new Error('Only admins or sellers can delete products');
    }
    
    if (!token) {
      throw new Error('Please login first. No authentication token found.');
    }
    
    const { data } = await axios.delete(`${apis.prod}/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (data.ok) {
      // Update Redux
      dispatch(removeProductFromList(productId));
      dispatch(clearCurrentProduct());
      
      return { 
        success: true, 
        message: data.message || 'Product deleted successfully',
        deletedProductId: productId
      };
    } else {
      throw new Error(data.error || 'Delete failed');
    }
  } catch (err) {
    console.error("❌ Delete error:", err);
    
    let errorMessage = 'Failed to delete product';
    
    if (err.response?.status === 401) {
      errorMessage = 'Please login as admin or seller to delete products';
    } else if (err.response?.status === 403) {
      errorMessage = 'Admin or seller access required';
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

// ============================================
// ACTION: Update Product (ADMIN OR SELLER)
// ============================================
export const updateProduct = (productId, updatedProductData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const user = getUserInfo();
    const token = localStorage.getItem('token');
    
    if (!isAdminOrSeller(user)) {
      throw new Error('Only admins or sellers can update products');
    }
    
    if (!token) {
      throw new Error('Please login first. No authentication token found.');
    }
    
    const { data } = await axios.put(
      `${apis.prod}/${productId}`,
      updatedProductData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (data.ok && data.product) {
      dispatch(setProduct(data.product));
      return { 
        success: true, 
        product: data.product, 
        message: data.message || 'Product updated successfully'
      };
    } else {
      throw new Error(data.error || data.message || 'Update failed');
    }
  } catch (err) {
    let errorMessage = 'Failed to update product';
    
    if (err.response?.status === 401) {
      errorMessage = 'Please login as admin or seller to update products';
    } else if (err.response?.status === 403) {
      errorMessage = 'Admin or seller access required';
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setError(errorMessage));
    throw new Error(errorMessage);
  }
};

// ============================================
// ACTION: Create New Product (ADMIN OR SELLER)
// ============================================
export const createProduct = (newProductData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const user = getUserInfo();
    const token = localStorage.getItem('token');
    
    if (!isAdminOrSeller(user)) {
      throw new Error('Only admins or sellers can create products');
    }
    
    if (!token) {
      throw new Error('Please login first. No authentication token found.');
    }
    
    const { data } = await axios.post(
      apis.prod,
      newProductData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (data.ok && data.product) {
      return { 
        success: true, 
        product: data.product, 
        message: data.message || 'Product created successfully'
      };
    } else {
      throw new Error(data.error || data.message || 'Create failed');
    }
  } catch (err) {
    let errorMessage = 'Failed to create product';
    
    if (err.response?.status === 403) {
      errorMessage = 'Admin or seller access required';
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setError(errorMessage));
    throw new Error(errorMessage);
  }
};

// ============================================
// ACTION: Get Products by Category (Client-side filtering)
// ============================================
export const getProductsByCategory = (category) => async (dispatch) => {
  dispatch(setLoading());
  try {
    // First fetch all products
    const { data } = await axios.get(apis.prod);
    
    if (data.ok) {
      // Filter products by category on client side
      const filteredProducts = data.products.filter(product => 
        product.category?.toLowerCase().includes(category.toLowerCase())
      );
      
      dispatch(setProducts(filteredProducts));
    } else {
      throw new Error(data.error || 'Failed to fetch products');
    }
  } catch (err) {
    console.error("❌ Get by category error:", err.message);
    dispatch(setError(err.message));
  }
};

// ============================================
// ACTION: Get All Categories
// ============================================
export const getAllCategories = () => async () => {
  try {
    const { data } = await axios.get(apis.prod);
    if (data.ok && data.products) {
      // Extract unique categories from products
      const categories = [...new Set(data.products
        .map(p => p.category)
        .filter(Boolean)
      )];
      return categories;
    }
    return [];
  } catch (err) {
    console.error("❌ Get categories error:", err.message);
    return [];
  }
};

// ============================================
// Export all actions
// ============================================
export default {
  fetchProducts,
  fetchProduct,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductsByCategory,
  getAllCategories
};