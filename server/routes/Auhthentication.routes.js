import express from "express";
import * as user from "../controllers/user.controller.js";

const authRoute = express.Router();

// Public routes
authRoute.post('/signup', user.signup);
authRoute.post('/login', user.login);
authRoute.post('/change-password', user.changePassword);
authRoute.post('/contact', user.submitContactForm);

// Protected routes
authRoute.get('/profile', requireLoggedIn, user.getUserProfile);
authRoute.put('/update-profile', requireLoggedIn, user.updateProfile);

export default authRoute;