/*step 1: express import */
import express, { Router } from "express";
import * as prod from "../controllers/products.controller.js"; //tod0


/*step 2: create a route */
 const prodRoute = express.Router()
prodRoute.route("/")
  .get(prod.getProducts)
 .post( prod.addNewProduct)     ////you must be logged in
 prodRoute.post("/bulk-insert", prod.bulkInsertProducts)
 prodRoute.get("/grouped", prod.getGroupedProducts)
 prodRoute.put("/update-many", prod.updateManyProducts)
 prodRoute.get("/categories", prod.getAllCategories)
 prodRoute.get("/by-category", prod.getProductsByCategory);


 
/* for seprate products with same URLs */
prodRoute.route("/:id")
 .get(prod.getProduct)               ////you must be logged in  
 .put(prod.updateProduct)            ///you must be logged in 
 .delete(prod.deleteProduct)          ////you must be logged in 


/* for seprate products with seaprate URLs */
//prodRoute.get("/products/")
// prodRoute.post("/products/add/:id")
// prodRoute.get("/products/get/:id")
// prodRoute.put("/products/ut/:id")
// prodRoute.delete("/products/delete/:id")

// http://localhost:8080/api/v1/products -postman get POST 
//OR
//  prodRoute.get("/products",prod.getProducts)
//  prodRoute.post("/add-product",prod.addNewProduct)
export default prodRoute
/*
prodRoute.Route("/products").get(fetchAllProducts)
                             .post(addNewProduct)
*/ 