import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const app = express();

import { PORT, JWT_SECRET } from "./config/config.js";
const port = PORT || 9000;

// Debug: Check environment variables
console.log('🔍 Environment Check:');
console.log('- GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('- GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('- JWT_SECRET:', JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('- SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Set' : '❌ Missing');
console.log('- PORT:', port);
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');

/* Middleware */
app.use(express.json());
import cors from "cors";
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
import morgan from "morgan";
app.use(morgan("dev"));

/* OAuth & Session */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import jwt from 'jsonwebtoken';

/* Import User model for Google OAuth */
import User from './models/model.users.js';

/* Session middleware */
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_change_in_production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

/* Test Route */
app.get('/api/v1', (req, res) => { 
    res.json({ 
        success: true,
        message: 'API is up and running',
        timestamp: new Date().toISOString()
    }) 
});

/* Debug route for OAuth setup */
app.get('/api/v1/auth/debug', (req, res) => {
    res.json({
        status: 'active',
        googleClientId: process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Missing',
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✅ Configured' : '❌ Missing',
        jwtSecret: JWT_SECRET ? '✅ Configured' : '❌ Missing',
        sessionSecret: process.env.SESSION_SECRET ? '✅ Configured' : '❌ Missing',
        callbackUrl: `http://localhost:${port}/api/v1/auth/google/callback`,
        frontendUrl: "http://localhost:5173",
        serverPort: port,
        nodeEnv: process.env.NODE_ENV || 'development'
    });
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
    callbackURL: `http://localhost:${port}/api/v1/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Extract user info from Google profile
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;
        
        console.log('🔐 Google OAuth attempt for:', email);
        console.log('📱 Google ID:', googleId);
        
        // Check if user exists in database
        let user = await User.findOne({ 
            $or: [
                { email: email },
                { googleId: googleId }
            ]
        });
        
        if (!user) {
            // Create new user with googleId
            user = new User({
                email: email,
                name: name,
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || '',
                googleId: googleId,
                isVerified: true,
                role: 'user',
                password: 'google-oauth-no-password-required',
                loginMethod: 'google'
            });
            await user.save();
            console.log('✅ New Google user created. User ID:', user._id);
        } else {
            // Update existing user with googleId if not set
            if (!user.googleId) {
                user.googleId = googleId;
                user.loginMethod = 'google';
                await user.save();
            }
            console.log('✅ Existing Google user found. User ID:', user._id);
        }
        
        const userData = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        };
        
        console.log('✅ Google authentication successful for:', email);
        return done(null, userData);
        
    } catch (error) {
        console.error('❌ Google OAuth error:', error);
        return done(error, null);
    }
}));

/* Google OAuth Routes */
app.get('/api/v1/auth/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account' // Always show account selection
    })
);

app.get('/api/v1/auth/google/callback',
    passport.authenticate('google', { 
        failureRedirect: 'http://localhost:5173/login?error=auth_failed',
        session: false
    }),
    async (req, res) => {
        try {
            console.log('✅ Google auth successful! User:', req.user);
            
            // Find the user in DB to get fresh data
            const user = await User.findById(req.user._id);
            if (!user) {
                console.error('❌ User not found in database after OAuth');
                return res.redirect('http://localhost:5173/login?error=user_not_found');
            }
            
            // Generate JWT token
            const token = jwt.sign(
                { 
                    _id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role
                }, 
                JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            console.log('✅ JWT token created');
            
            // Verify the token immediately
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                console.log('✅ Token self-verified:', decoded);
            } catch (verifyError) {
                console.error('❌ Token verification failed:', verifyError);
                return res.redirect('http://localhost:5173/login?error=token_creation_failed');
            }
            
            // Prepare user data for frontend
            const userData = {
                _id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
                loginMethod: user.loginMethod || 'google'
            };
            
            // Encode for URL
            const encodedUser = encodeURIComponent(JSON.stringify(userData));
            
            // Redirect to frontend with token
            const redirectUrl = `http://localhost:5173/dashboard?token=${token}&user=${encodedUser}`;
            console.log('🔀 Redirecting to:', redirectUrl);
            
            res.redirect(redirectUrl);
            
        } catch (error) {
            console.error('❌ Google callback error:', error);
            console.error('Stack:', error.stack);
            res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(error.message)}`);
        }
    }
);

/* Manual token creation route (for testing) */
app.get('/api/v1/test/create-token', async (req, res) => {
    try {
        // Get any user from database
        const user = await User.findOne({});
        
        if (!user) {
            return res.json({ 
                success: false, 
                error: 'No users found in database' 
            });
        }
        
        const token = jwt.sign(
            { 
                _id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }, 
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Test token created',
            token: token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            debug: `http://localhost:5173/dashboard?token=${token}`
        });
    } catch (error) {
        res.json({ 
            success: false, 
            error: error.message 
        });
    }
});

/* Test authentication endpoint */
app.get('/api/v1/auth/test', async (req, res) => {
    try {
        // Get token from query or header
        const token = req.query.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.json({ 
                success: false, 
                message: 'No token provided' 
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded._id).select('-password');
        
        if (!user) {
            return res.json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Token is valid',
            user: user,
            tokenData: decoded
        });
        
    } catch (error) {
        res.json({
            success: false,
            message: 'Token verification failed',
            error: error.message,
            errorType: error.name
        });
    }
});

/* Start server */
app.listen(port, () => {
    console.log(`🚀 Server is running: http://localhost:${port}`);
    console.log(`🔐 Google OAuth URL: http://localhost:${port}/api/v1/auth/google`);
    console.log(`📊 Debug info: http://localhost:${port}/api/v1/auth/debug`);
});

/* Database connection */
import dbConfig from "./config/dbconfig.js";
dbConfig();
