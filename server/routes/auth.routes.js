import express from "express";
import { signup, login } from "../controllers/auth.controller.js";

const router = express.Router();

// POST /api/v1/auth/signup
router.post("/signup", signup);

// POST /api/v1/auth/login  ← ADD THIS!
router.post("/login", login);

export default router;