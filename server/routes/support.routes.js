import express from "express";
import * as user from "../controllers/user.controller.js";
import { requireLoggedIn, requireAdmin } from "../middlewares/decodeToken.js";

const supportRoute = express.Router();

// Public support submission (no login required)
supportRoute.post('/submit', user.submitSupportMessage);

// User support routes (logged in users)
supportRoute.get('/my-messages', requireLoggedIn, user.getUserSupportMessages);
supportRoute.get('/message/:id', requireLoggedIn, user.getSupportMessageById);
supportRoute.get('/stats', requireLoggedIn, user.getSupportStats);

// Admin support routes
supportRoute.get('/admin/all', requireLoggedIn, requireAdmin, user.getAllSupportMessages);
supportRoute.put('/admin/:id/status', requireLoggedIn, requireAdmin, user.updateSupportMessageStatus);
supportRoute.delete('/admin/:id', requireLoggedIn, requireAdmin, user.deleteSupportMessage);

export default supportRoute;