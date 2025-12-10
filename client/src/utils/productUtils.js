// src/utils/productUtils.js

// Filter products by category
export const filterByCategory = (products, category) => {
  if (!products || !category) return [];
  
  return products.filter(product => {
    const productCategory = product.category?.toLowerCase();
    const targetCategory = category.toLowerCase();
    
    // Multiple matching strategies
    return (
      productCategory === targetCategory ||
      productCategory?.includes(targetCategory) ||
      targetCategory.includes(productCategory) ||
      (targetCategory === 'home' && productCategory?.includes('home')) ||
      (targetCategory === 'kitchen' && productCategory?.includes('kitchen')) ||
      (targetCategory === 'appliances' && (
        productCategory?.includes('appliance') ||
        productCategory?.includes('electronic') ||
        productCategory?.includes('device')
      )) ||
      (targetCategory === 'outdoor' && (
        productCategory?.includes('outdoor') ||
        productCategory?.includes('garden') ||
        productCategory?.includes('patio')
      ))
    );
  });
};

// Get unique categories from products
export const extractCategories = (products) => {
  if (!products) return [];
  
  const categories = [...new Set(products
    .map(p => p.category)
    .filter(Boolean)
  )];
  
  return categories;
};

// Group products by category
export const groupProductsByCategory = (products) => {
  if (!products) return {};
  
  return products.reduce((groups, product) => {
    const category = product.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});
};