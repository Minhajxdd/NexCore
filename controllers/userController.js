// Importing Services
import {generateOTP, sendOTP, verifyPin, tempUser, createUser} from '../services/otpServices.js';


export const loginGet = (req , res) => {
    res.render('pages/user/login');
}

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
        maxAge: 5 * 60 * 1000, 
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

