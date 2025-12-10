/* 1. fetch all products --- GET - /api/v1/products */
// 1) GET all products 
import Product from "../models/model.products.js";
const getProducts = async (req, res)=> {
    try{
        const products = await Product.find() // fetch from MongoDB 
        const total = products.length 
        if(total > 0 ) {
            res.json({
            ok : true,
            total: `We have ${total} products in our db`,
            products // send actuall array
            })
        } else{
            res.json({
            ok : false,
            error : `There is no product found` 
            })   
        }
    } catch(err){
       console.log(err.message)
    }
}
// 1) Add New Products 
const addNewProduct = async (req, res) =>{
    try{
    const {title, brand, category, price, description, subTitle,stock, image } = req.body
    const product = new Product ({
        title,
        brand, 
        category,
        price, 
        description, 
        subTitle,
        image,
        stock,  
    })
    await product.save()
    res.json ({
        ok:true,
        message: `Product inserted successfully `,
        product 
    })
    } catch(err) {
         res.json ({
            ok: false,
            error:`Server Error while Adding Product`,
            message: err.message
         })   
    }

}
 //3) Fetch single product by ID
const getProduct = async(req, res) => {
try{
    const id = req.params.id
    const product = await  Product.findById(id)
    if(!product){
      return res.json ({
            ok: false ,  
            error:` Product not found : id ${id}`
        })
    }
     return res.json ({
            ok : true, 
            product // send the fetched document 
        })

}catch(err){
        console.log(`this is the error which is coming from try block`)
}
}
// 4) Update existing product
const updateProduct = async (req, res) => {
try{
const id = req.params.id 
const updatedProduct = await Product.findByIdAndUpdate
(id, req.body,{new: true})
if(!updatedProduct){
    return res.json ({
        ok : false, 
        error : `Product not found: id ${id}`
    })
}
return res.json ({
    ok: true , 
    product: updatedProduct,
    message : 'Product updated successfully'
})

}
catch(err){
console.log(err.message)
}
}
// 5) Delete product
const deleteProduct = async (req, res)=>{
try{
    const id = req.params.id
    const deletedProduct = await Product.findByIdAndDelete(id)
    if(!deletedProduct){
        return res.json({
            ok: false,
            error: `Product not found ${id}`

        })
    }
    return res.json({
        ok: true,
        message: 'Product deleted successfully'
    })
}catch(err){
  console.log(err.message)
}

}
// 6) grouped products
const getGroupedProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    const grouped = {};

    allProducts.forEach(p => {
      const cat = p.category || "Uncategorized"; // fallback if category missing
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });

    res.json({
      ok: true,
      categories: grouped
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ ok: false, message: err.message });
  }
};
// 7) Update Many Products
const updateManyProducts = async (req, res) => {
  try {
    const { category } = req.body;
    const result = await Product.updateMany(
      { category: { $exists: false } }, // Filter products with NO category
      { $set: { category } }            // Set category to what user sends
    );
    res.json({
      success: true,
      message: "Categories updated for all products without category"
    });
  } catch (err) {
   console.log(err.message)
  }
}

//8 Get All Categories 
const getCategories = async (req, res) => {
    try{
    const categories = await Product.distinct("category")
     res.json ({
        ok: true,
        categories
    })
    }catch(err){
       console.log(err.message)
    }
}

//9 Get Products By Category 
const getProductsByCategory = async (req, res) =>{
    try{
       const {category, page = 1, limit = 5} = req.query
       if(!category) {
        return res.json ({
         ok: false,
         message : 'Category is required'  
        })
        }
    const limitNum = parseInt(limit)
    const skip =(parseInt(page) - 1) * limit;
    const products = await Product.find({category})
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    const total = await Product.countDocuments({category})
    const totalPages = Math.ceil(total/limitNum)
    res.json({
        ok: true,
        category,
        page: parseInt(page),
        totalPages,
        products
    })
    }catch(err){
            console.log(err.message)
    }
}

// 10) Get All Categories 
 const getAllCategories = async (req, res) => {
  try {
    // Get unique categories from your products
    const categories = await Product.distinct("category");

    res.json({
      ok: true,
      categories
    })
  } catch (err) {
    console.log(err.message);
  }
}
// 11) Add Bulk Products
const bulkInsertProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.json({ ok: false, error: "Products array is required" });
    }

    const result = await Product.insertMany(products);

    res.json({
      ok: true,
      message: "All products inserted successfully",
      count: result.length
    });
  } catch (err) {
    console.log(err.message);
    res.json({ ok: false, error: err.message });
  }
}






    export{
    getProducts,
    addNewProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getGroupedProducts,
    updateManyProducts,
    getCategories,
    getProductsByCategory,
    getAllCategories,
    bulkInsertProducts
    
}