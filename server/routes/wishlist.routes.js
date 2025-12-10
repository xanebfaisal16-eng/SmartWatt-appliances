import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/whislist.controller.js";
import { requireLoggedIn } from "../middlewares/decodeToken.js"; 

const router = express.Router();

// Protected Routes
router.post("/add/:productId", requireLoggedIn, addToWishlist);
router.delete("/remove/:productId", requireLoggedIn, removeFromWishlist);
router.get("/", requireLoggedIn, getWishlist);

export default router;
