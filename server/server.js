import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const app = express();

import { PORT } from "./config/config.js";
const port = PORT || 9000;

/* Middleware */
app.use(express.json());
import cors from "cors";
app.use(cors());
import morgan from "morgan";
app.use(morgan("dev"));

/* OAuth & Session */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import jwt from 'jsonwebtoken';  // Add this import

/* Session middleware - FIXED version */
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret_here',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

/* Test Route */
app.get('/api/v1', (req, res) => { 
    res.send('API is up and running') 
});

/* Import existing routes */
import prodRoute from './routes/products.route.js';
app.use("/api/v1/products", prodRoute);

import userRoute from './routes/users.route.js';
app.use("/api/v1/users", userRoute);

import wishlistRoute from './routes/wishlist.routes.js';
app.use("/api/v1/wishlist", wishlistRoute);


/* ====== GOOGLE OAUTH CONFIG ====== */
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/v1/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
    // Extract user info from Google profile
    const user = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        photo: profile.photos[0]?.value
    };
    console.log('Google user authenticated:', user.email);
    return done(null, user);
}));

/* Google OAuth Routes */
app.get('/api/v1/auth/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

app.get('/api/v1/auth/google/callback',
    passport.authenticate('google', { 
        failureRedirect: 'http://localhost:5173/login',
        session: false  // Disable session to avoid regenerate error
    }),
    (req, res) => {
        console.log('Google auth successful! User:', req.user);
        
        // Create JWT token
        const token = jwt.sign(
            { 
                id: req.user.id, 
                email: req.user.email,
                name: req.user.name 
            }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '7d' }
        );
        
        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    }
);

/* Start server */
app.listen(port, () => {
    console.log(`Server is running: http://localhost:${port}`);
});

/* Database connection */
import dbConfig from "./config/dbconfig.js";
dbConfig();