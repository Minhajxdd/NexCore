
// Importing Models
import orderModel from "../../models/orderSchema.js";
import productModel from "../../models/productSchems.js";

export async function ordersDetails(id){
    try{

        const data = await orderModel.find(
            {
                user_id: id
            }
        )
        return data;

    }catch(err){
        console.log(`error while fething orders details: ${err.message}`);
    }
};


export async function getProductDetails(id){
    try{
        return await productModel.findById(id);
    }catch(err){
        console.log(`error while fetching product details:${err.message}`);
    }
}