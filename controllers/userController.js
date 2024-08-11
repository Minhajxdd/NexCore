

export const login = (req , res) => {
    res.send('ths is login page form controller');
}

export const home = (req , res) => {
    res.render('pages/home');
}

export const signup = (req , res) => {
    res.render('pages/signup');
}