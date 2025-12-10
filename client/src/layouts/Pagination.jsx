import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryPagination = () => {
  const [categories, setCategories] = useState([]); // All categories
  const [categoryPages, setCategoryPages] = useState({}); // Track current page per category
  const [productsByCategory, setProductsByCategory] = useState({}); // Products per category
  const [totalPagesByCategory, setTotalPagesByCategory] = useState({}); // Total pages per category

  // Fetch all categories
  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/products/categories")
      .then(res => {
        setCategories(res.data.categories);

        // Initialize pages for each category
        const initialPages = {};
        res.data.categories.forEach(cat => { initialPages[cat] = 1; });
        setCategoryPages(initialPages);
      })
      .catch(err => console.log(err));
  }, []);

  // Fetch products whenever category page changes
  useEffect(() => {
    categories.forEach(category => {
      const page = categoryPages[category] || 1;
      axios.get(`http://localhost:8080/api/v1/products/by-category?category=${category}&page=${page}&limit=4`)
        .then(res => {
          setProductsByCategory(prev => ({ ...prev, [category]: res.data.products }));
          setTotalPagesByCategory(prev => ({ ...prev, [category]: res.data.totalPages }));
        })
        .catch(err => console.log(err));
    });
  }, [categories, categoryPages]);

  // Handle page change for a specific category
  const handlePageChange = (category, newPage) => {
    setCategoryPages(prev => ({ ...prev, [category]: newPage }));
  };

  return (
    <div>
      {categories.map(category => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{category.toUpperCase()}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productsByCategory[category]?.map(product => (
              <div key={product._id} className="bg-gray-800 p-2 rounded">
                <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover rounded"/>
                <h4 className="mt-2">{product.title}</h4>
                <p>{product.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              disabled={categoryPages[category] === 1}
              onClick={() => handlePageChange(category, categoryPages[category] - 1)}
              className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {categoryPages[category]} of {totalPagesByCategory[category]}</span>
            <button
              disabled={categoryPages[category] === totalPagesByCategory[category]}
              onClick={() => handlePageChange(category, categoryPages[category] + 1)}
              className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryPagination;
