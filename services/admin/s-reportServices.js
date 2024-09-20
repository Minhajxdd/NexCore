// Importing Model
import couponModel from "../../models/couponSchema.js";
import orderModel from '../../models/orderSchema.js';


export async function sreportFilter(options){
    try{
        console.log(options)

        const data = await orderModel.find();

        return data
    }catch(err){
        console.log(`error while fetching options data`);
    }
}