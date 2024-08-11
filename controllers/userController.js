

export const loginGet = (req , res) => {
    res.render('pages/user/login');
}

export const homeGet = (req , res) => {
    res.render('pages/user/home');
}

export const signupGet = (req , res) => {
    res.render('pages/user/signup');
}

export const getOtp = (req , res) => {
    res.render('pages/user/otp');
}