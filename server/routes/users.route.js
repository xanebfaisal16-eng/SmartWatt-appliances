import express from "express";
import * as user from "../controllers/user.controller.js";
import { requireLoggedIn } from "../middlewares/decodeToken.js";
import { requireAdmin } from "../controllers/user.controller.js";

const userRoute = express.Router();

// =================== PUBLIC ROUTES ===================
userRoute.post("/signup", user.signup);
userRoute.post("/login", user.login);
// userRoute.post("/change-password", user.changePassword);

// =================== PROTECTED ROUTES (LOGGED-IN USERS) ===================
userRoute.get("/profile", requireLoggedIn, user.getUserProfile);
userRoute.put("/update-profile", requireLoggedIn, user.updateProfile);
userRoute.get("/fetch-logged-user", requireLoggedIn, user.fetchLoggedUser);

// Dashboard stats endpoint
userRoute.get("/dashboard-stats", requireLoggedIn, user.getDashboardStats);

// =================== DANGER ZONE / ACCOUNT MANAGEMENT ===================
// Export user data
userRoute.get("/export-data", requireLoggedIn, user.exportData);

// Delete user account
userRoute.delete("/delete-account", requireLoggedIn, user.deleteAccount);

// =================== ADMIN ONLY ROUTES ===================
userRoute.get("/all-users", requireLoggedIn, requireAdmin, user.getAllUsers);
userRoute.get("/admin-stats", requireLoggedIn, requireAdmin, user.getAdminStats);

// =================== OPTIONAL / PUBLIC ROUTES ===================
// userRoute.get("/public-profile", user.publicProfile);

export default userRoute;