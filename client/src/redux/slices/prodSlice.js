import { createSlice } from "@reduxjs/toolkit";

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  loading: false,
  error: null,
  products: [],      // All products array
  product: null,     // Single product object
};

// ============================================
// PRODUCT SLICE
// ============================================
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    
    // ========================================
    // ACTION: Start Loading
    // ========================================
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // ========================================
    // ACTION: Set All Products
    // ========================================
    setProducts: (state, { payload }) => {
      state.products = payload;
      state.loading = false;
      state.error = null;
    },
    
    // ========================================
    // ACTION: Set Single Product
    // ========================================
    setProduct: (state, { payload }) => {
      state.product = payload;
      state.loading = false;
      state.error = null;
    },
    
    // ========================================
    // ACTION: Clear Current Product
    // ========================================
    clearCurrentProduct: (state) => {
      state.product = null;
      state.loading = false;
    },
    
    // ========================================
    // ACTION: Remove Product from List (for delete)
    // ========================================
    removeProductFromList: (state, { payload }) => {
      state.products = state.products.filter(
        product => product._id !== payload
      );
    },
    
    // ========================================
    // ACTION: Update Product in List
    // ========================================
    updateProductInList: (state, { payload }) => {
      const index = state.products.findIndex(
        product => product._id === payload._id
      );
      if (index !== -1) {
        state.products[index] = payload;
      }
    },
    
    // ========================================
    // ACTION: Set Error
    // ========================================
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
    
    // ========================================
    // ACTION: Clear Error
    // ========================================
    clearError: (state) => {
      state.error = null;
    },
    
    // ========================================
    // ACTION: Reset Product State
    // ========================================
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.products = [];
      state.product = null;
    }
  }
});

// ============================================
// EXPORT ACTIONS
// ============================================
export const {
  setLoading,
  setProducts,
  setProduct,
  clearCurrentProduct,
  removeProductFromList,
  updateProductInList,
  setError,
  clearError,
  resetProductState
} = productSlice.actions;

// ============================================
// EXPORT REDUCER
// ============================================
export default productSlice.reducer;