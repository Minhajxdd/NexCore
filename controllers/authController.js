import passport from 'passport';

// Importing Services
import {generateOTP, sendOTP, verifyPin, tempUser, createUser, loginUser} from '../services/authServices.js';

import '../services/googleAuth.js';

export const signupGet = (req , res) => {
    res.render('pages/user/signup');
}

export const signupPost = async (req , res) => {

    const { email } = req.body;
    const otp = await generateOTP();

    // Send OTP via email
    await sendOTP(email, otp , req.body.fullname);
    // console.log("OTP sent");

    tempUser(req.body , otp);

    res.cookie('email', req.body.email, {
        maxAge: 1.5 * 60 * 1000, 
        httpOnly: true, 
      });

    res.redirect('/otp');
}

export const getOtp = (req , res) => {

    if(req.query){
        const errorCode = Number(req.query.error);
        switch(errorCode){
            case 1:
                return res.render('pages/user/otp' , {ERROR_MESSAGE : "Wrong Otp!!"});
        }
    }

    res.render('pages/user/otp' , {ERROR_MESSAGE : ''});
}

export const postOtp = async (req , res) => {
    const email = req.cookies.email;
    const otp = req.body.otp;
    const data = await verifyPin(email , otp);    
    // console.log(data)

    if(data.length === 0){
        return res.redirect('/otp?error=1');
    }

    createUser(email);

    res.redirect('/login');
}

export const loginGet = (req, res) => {
    
    if(req.query){
        const errorCode = Number(req.query.err);
        switch(errorCode){
            case 1:
                return res.render('pages/user/login' , {alertMessage : `User or password not found!`});
        }
    }

    res.render('pages/user/login' , {alertMessage : null});
}

export const loginPost = async (req, res) => {

    const { email , password } = req.body;

    const userData = await loginUser(email, password);

    if(userData.length === 0){
        return res.redirect('/login?err=1')
    }

    req.session.user = email;
    res.redirect('/');
}

export const NotFound = (req, res) => {
    res.render('404');
}

// Google Auth Contollers
  
export const googleAuth = (req, res, next) => {
    passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
};
  
export const googleCallback = (req, res, next) => {
    passport.authenticate('google', {
      successRedirect: '/auth/protected',
      failureRedirect: '/auth/google/failure'
    })(req, res, next);
};

export function protectedRoute(req, res){
    req.session.user = req.user.googleId;
    res.redirect('/');
}

export const googleFailure = (req, res) => {
    res.send('Something went wrong');

};

export function logout(req, res){
    req.session.user = null;
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    })
}

// Google Auth Contollers


