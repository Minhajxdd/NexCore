
// Importing Services
import { getProducts, getProductDetails } from '../services/user/homeServices.js';


export async function homeGet(req, res){
    const products = await getProducts();
    res.render('pages/user/home', {
        products
    });
}

export async function productGet(req, res){
    const product = await getProductDetails();
    const products = await getProducts();
    res.render('pages/user/product' , {
        product,
        products
    });
}