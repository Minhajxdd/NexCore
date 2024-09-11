

import productModel from '../../models/productSchema.js';
import categoryModel from '../../models/categorySchema.js';

export async function getProducts(catId){
    try{
        const products = await productModel.find().limit(6);
        return products;
    }catch(err){
        console.log(`error while fetching data getProducts on homeServices ${err.message}`);
    }
}

export async function getProductDetails(id){
    try{
        const product = await productModel.findById(id);
        return product;
    }catch(err){
        console.log(`error while fetching product data at homeServices ${err.message}`);
    }
}