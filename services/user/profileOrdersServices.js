
// Importing Models
import orderModel from "../../models/orderSchema.js";
import productModel from "../../models/productSchems.js";
import addressModel from "../../models/addressSchema.js";

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
    };
};


export async function getProductDetails(id){
    try{
        return await productModel.findById(id);
    }catch(err){
        console.log(`error while fetching product details:${err.message}`);
    };
};


export async function getAddressIdAndUser(addressId, userId){
    try{

        const data = await orderModel.find({
            _id: addressId,
            user_id: userId
        })
        return data;

    }catch(err){
        console.log(`error while fetching productId and userId: ${err.message}`);
    };
};

export async function addressDetailsGet(id){
    try{
        const data = await addressModel.findById(id);
        return data;
    }catch(err){
        console.log(`error while fetching address details: ${err.message}`);
    };
};


export async function orderCancel(id){
    try{
        await orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    orderStatus: 'cancelled'
                }
            }
        )
        return true;
    }catch(err){
        console.log(`error on order status update: ${err.message}`);
        return false;
    };
};
