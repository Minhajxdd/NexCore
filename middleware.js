import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';

const cookieMiddleWare = cookieParser();

const expressStatic = express.static('public');

const urlEncodedParser = express.urlencoded({extended: false});
const jsonParser = express.json();

// Session Handling
const sessionHandler = session({
    secret: 'Secret Key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/NexCore' }), 
    cookie: { 
        maxAge: 60000 * 60 * 3,
        secure: false
    },
    
});


const passportInitialize = passport.initialize();
const passportSession = passport.session();


// Authentication Middleware
function isAuthenticated(req, res, next){

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

    // if(req.path.startsWith('/admin')){
    //     if(req.session.fdaf){
    //         return next();
    //     }
    //     return res.redirect('/admin/login');
    // }

    if(req.session.user){
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
    // app.use(isAuthenticated);
};

export default applyMiddlewares;