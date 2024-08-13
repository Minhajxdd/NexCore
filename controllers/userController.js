// Importing Services
import {generateOTP, sendOTP, verifyPin, tempUser, createUser, loginUser} from '../services/authServices.js';

export const homeGet = (req , res) => {
    res.render('pages/user/home');
}

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

export const logRedirect = (req, res, next) => { 
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
} 