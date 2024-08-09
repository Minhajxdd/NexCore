

export const signup = (req , res) => {
    res.send("This is home page fron controller");
}

export const login = (req , res) => {
    res.send('ths is login page form controller');
}

export const home = (req , res) => {
    res.render('pages/index');
}