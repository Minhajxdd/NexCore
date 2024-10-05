import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import mongoose from 'mongoose';

const cookieMiddleWare = cookieParser();

const expressStatic = express.static('public');

const urlEncodedParser = express.urlencoded({extended: false});
const jsonParser = express.json();

// Importing Schemas
import userModel from './models/userSchema.js';

// Session Handling
const sessionHandler = session({
    secret: 'Secret Key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }), 
    cookie: { 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: false
    },
    
});


const passportInitialize = passport.initialize();
const passportSession = passport.session();


// Authentication Middleware
async function isAuthenticated(req, res, next){

    if(req.path === '/login' && req.session.user){
        return res.redirect('/');
    }

    const allowedRoutes = ['/login', '/signup', '/auth/google', '/auth/google/callback', '/otp', '/otp/verify', '/password_reset', '/auth/protected', '/otp/re-sent', '/password_resent/otp'];

    if(allowedRoutes.includes(req.path)){
        return next();
    }

    if(req.path.startsWith('/admin')){
        return next();
    }

    if(req.session.user){

        const userId = req.session.userId || req.session.passport.user;

        const { isBlocked } = await userModel
        .findOne({_id: userId}, {_id:0,isBlocked:1})
        .lean();

        if(isBlocked) {
            req.session.user = null;
            req.session.userId = null;
            req.session.cartId = null;

            return res.redirect('/login');
        }

        return next();
    }

    res.redirect('/login');

}


const applyMiddlewares = (app) => {
    app.use(cookieMiddleWare);
    app.use(expressStatic);
    app.use(urlEncodedParser);
    app.use(jsonParser);
    app.use(sessionHandler);
    app.use(passportInitialize);
    app.use(passportSession);
    app.use(isAuthenticated);
};

export default applyMiddlewares;