

import productModel from '../../models/productSchems.js';
import categoryModel from '../../models/categorySchema.js';

export async function getProducts(catId){
    try{
        const products = await productModel.find().limit(6);
        return products;
    }catch(err){
        console.log(`error while fetching data getProducts on homeServices ${err.message}`);
    }
}

export async function getProductDetails(){
    const id = '66c5a8cdb1ae2e5996d26e6b';
    try{
        const product = await productModel.findById(id);
        return product;
    }catch(err){
        console.log(`error while fetching product data at homeServices ${err.message}`);
    }
}