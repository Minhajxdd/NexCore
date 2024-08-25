
// Importing Services
import { getProducts, getProductDetails } from '../services/user/homeServices.js';


export async function homeGet(req, res){
    const products = await getProducts();
    res.render('pages/user/home', {
        products
    });
}

export async function productGet(req, res){
    if(!req.query.id) return res.redirect('/not-found');
    const product = await getProductDetails(req.query.id);
    if(!product) return res.redirect('/not-found');
    const products = await getProducts();
    res.render('pages/user/product' , {
        product,
        products
    });
}

export async function cartGet(req, res){
    res.render('pages/user/cartPage');
}