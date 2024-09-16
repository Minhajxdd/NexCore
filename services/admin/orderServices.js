// Importing Model
import ordersModel from '../../models/orderSchema.js';
import userModel from '../../models/userSchema.js';

export async function getAllOrders(userId){
    try{
        const data = await ordersModel.find()

        return data;
    }catch(err){
        console.log(`error while fetching all orders: ${err.message}`);
    }
}

export async function getUsersData(userId){
    try{
        return await userModel.find();
    }catch(err){
        console.log(`error while fetching user data on orderServices: ${err.message}`);
    }
}


export async function updateOrderStatus(id, status){
    try{
        await ordersModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    orderStatus: status
                }
            }
        )
        return true;
    }catch(err){
        console.log(`error while updating data on orderServices: ${err.message}`);
        return false;
    }
}