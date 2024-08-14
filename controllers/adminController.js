

import { createUser, getUsers } from '../services/admin/usersServices.js';


export const loginGet = (req, res) => {

    if(req.query){
        const err = Number(req.query.err); 
        switch(err){
            case 1:
               return res.render('pages/admin/admin_login', {alertMessage : "user name or password not found!!"});
        }
    }

    res.render('pages/admin/admin_login' , {alertMessage : ''});
}

export const loginPost = (req, res) => {
    const {uname, password } = req.body;
    if(uname === 'Admin' && password === 'admin123'){
        return res.json({
            status: "success",
            message: "Admin verified successfully"
        })
    }

    res.redirect('/admin/login?err=1');

}

export const homeGet = (req, res) => {
    res.render(`pages/admin/dashboard`); 
}
 
export const usersGet = async (req, res) => {
    const users = await getUsers();

    res.render(`pages/admin/user`, {
        users
        });
}

export const usersPost = async (req, res) => {

    await createUser(req.body);

    res.redirect('/admin/users');
}


export const productsGet = (req, res) => {
    res.render(`pages/admin/product`);
}

export const ordersGet = (req, res) => {
    res.render(`pages/admin/orders`);
}

export const couponsGet = (req, res) => {
    res.render(`pages/admin/coupons`);
}

export const salesReportGet = (req, res) => {
    res.render(`pages/admin/s-report`);
}