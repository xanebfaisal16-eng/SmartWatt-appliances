import React, { useState, useEffect, useRef } from 'react';
import ProductsCard from "../layouts/ProductsCard";
import axios from "axios";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const limit = 4;

  const productsRef = useRef(null);

  // Fetch all categories
  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/products/categories")
      .then(res => setCategories(res.data.categories))
      .catch(err => console.log(err));
  }, []);

  // Fetch all products for search
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const categoriesRes = await axios.get("http://localhost:8080/api/v1/products/categories");
        const categoriesList = categoriesRes.data.categories;
        let allProductsData = [];
        for (const category of categoriesList) {
          try {
            const res = await axios.get(
              `http://localhost:8080/api/v1/products/by-category?category=${encodeURIComponent(category)}&page=1&limit=50`
            );
            if (res.data.products) allProductsData = [...allProductsData, ...res.data.products];
          } catch (err) {
            console.log(`Error fetching ${category}:`, err);
          }
        }
        setAllProducts(allProductsData);
      } catch (err) {
        console.log('Error fetching all products:', err);
        const testProducts = [
          {_id: '1', title: 'Mini Blender Smoothie Maker', category: 'Kitchen Appliances', description: 'Portable blender ideal for smoothies', images: ['https://m.media-amazon.com/images/I/71a6xjetuEL._AC_UY218_.jpg'], price: '35', stock: 20},
          {_id: '2', title: 'Stainless Steel Toaster', category: 'Kitchen Appliances', description: '2-slice stainless steel toaster', images: ['https://m.media-amazon.com/images/I/7149M21BX9L._AC_UY218_.jpg'], price: '25', stock: 20},
          {_id: '3', title: 'Ninja Air Fryer 4QT', category: 'Kitchen Appliances', description: '4-quart air fryer with fast cooking technology', images: ['https://m.media-amazon.com/images/I/71QwoGmcfUL._AC_UY218_.jpg'], price: '79', stock: 15}
        ];
        setAllProducts(testProducts);
      }
    };

    fetchAllProducts();
  }, []);

  // Fetch products for current category and page
  useEffect(() => {
    if (categories.length === 0) return;
    const category = categories[currentCategoryIndex];
    setLoading(true);
    axios.get(`http://localhost:8080/api/v1/products/by-category?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`)
      .then(res => {
        setFilteredProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [categories, currentCategoryIndex, page]);

  // Search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      const category = categories[currentCategoryIndex];
      setLoading(true);
      axios.get(`http://localhost:8080/api/v1/products/by-category?category=${encodeURIComponent(category)}&page=1&limit=${limit}`)
        .then(res => {
          setFilteredProducts(res.data.products);
          setPage(1);
          setLoading(false);
        });
      return;
    }

    const searchLower = query.toLowerCase().trim();
    const results = allProducts.filter(product => {
      const title = (product.title || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      return title.includes(searchLower) || description.includes(searchLower) || category.includes(searchLower);
    });
    setFilteredProducts(results);
    setPage(1);
  };

  // Pagination handlers with smooth scroll
  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Category navigation with scroll
  const nextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setPage(1);
      setSearchQuery('');
      productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const prevCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setPage(1);
      setSearchQuery('');
      productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    const category = categories[currentCategoryIndex];
    setLoading(true);
    axios.get(`http://localhost:8080/api/v1/products/by-category?category=${encodeURIComponent(category)}&page=1&limit=${limit}`)
      .then(res => {
        setFilteredProducts(res.data.products);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 p-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for toaster, blender, air fryer..."
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 text-lg"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-center mt-2 text-sm text-gray-400">
          Search across {allProducts.length} products
        </div>
      </div>

      {categories.length > 0 && (
        <>
          {/* Category Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {categories[currentCategoryIndex]}
              {searchQuery && <span className="text-yellow-400 ml-2">(Search Results)</span>}
            </h2>
            <p className="text-gray-300">
              {searchQuery 
                ? `Found ${filteredProducts.length} results for "${searchQuery}"` 
                : `${filteredProducts.length} products in this category`}
            </p>
          </div>

          {/* Products Grid */}
          <div ref={productsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({length: limit}).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-700 animate-pulse rounded-lg"></div>
                ))
              : filteredProducts.map(product => (
                  <ProductsCard key={product._id} product={product} />
                ))
            }
          </div>

          {/* Pagination */}
          {!searchQuery && (
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={prevPage} disabled={page === 1} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-700">← Previous</button>
              <span className="px-4 py-2">Page {page} of {totalPages}</span>
              <button onClick={nextPage} disabled={page === totalPages} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-700">Next →</button>
            </div>
          )}

          {/* Category Navigation */}
          {!searchQuery && (
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={prevCategory} disabled={currentCategoryIndex === 0} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-700">← Previous Category</button>
              <span className="px-4 py-2">{currentCategoryIndex + 1} / {categories.length}</span>
              <button onClick={nextCategory} disabled={currentCategoryIndex === categories.length - 1} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-700">Next Category →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
