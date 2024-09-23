// Importing Models
import orderModel from "../../models/orderSchema.js";
import productModel from "../../models/productSchema.js";
import addressModel from "../../models/addressSchema.js";
import walletModel from '../../models/walletSchema.js';

export async function ordersDetails(id) {
  try {
    const data = await orderModel
      .find({
        user_id: id,
      })
      .sort({ orderedAt: -1 });
    return data;
  } catch (err) {
    console.log(`error while fething orders details: ${err.message}`);
  }
}

export async function getProductDetails(id) {
  try {
    return await productModel.findById(id);
  } catch (err) {
    console.log(`error while fetching product details:${err.message}`);
  }
}

export async function getAddressIdAndUser(addressId, userId) {
  try {
    const data = await orderModel.find({
      _id: addressId,
      user_id: userId,
    });

    return data;
  } catch (err) {
    console.log(`error while fetching productId and userId: ${err.message}`);
  }
}

export async function addressDetailsGet(id) {
  try {
    const data = await addressModel.findById(id);
    return data;
  } catch (err) {
    console.log(`error while fetching address details: ${err.message}`);
  }
}

export async function orderCancel(id, userId) {
  try {
    const orderData = await orderModel.findByIdAndUpdate(id, {
      $set: {
        orderStatus: "cancelled",
      },
    });

    if(orderData.paymentMethod !== 'Cash on Delivery'){
      
      const update = {
        $inc: { balance_amount: parseInt(orderData.totalPrice - ( orderData.coupon || 0 ) - ( orderData.offer || 0 ))},
        $push: { 
          transactions: { 
            amount: orderData.totalPrice - ( orderData.coupon || 0 ) - ( orderData.offer || 0 ), 
            transaction_type: 'credit', 
            description: `Cancel #${orderData._id}` 
          }
        }
      };
  
      const options = { 
        upsert: true,
        setDefaultsOnInsert: true
      };
  
      await walletModel.findOneAndUpdate(
        { user_id: userId },
        update,
        options
      );


    }

    return true;
  } catch (err) {
    console.log(`error on order status update: ${err.message}`);
    return false;
  }
}

export async function validateOrder(id){
  try{
    const order = await orderModel.findById(id);
    
    if(!order){
      return false;
    }
    return true;

  }catch(err){
    console.log(`error while validating order: ${err.message}`);
    return false;
  }
}

export async function sendReturnRequest(data){
  try{
    await orderModel.findByIdAndUpdate(data.id, 
      {
        $set: {
          'returnRequest.request': 'requested',
          'returnRequest.reason': data.reason,
          'returnRequest.note': data.note,
        }
      }
    )
    
    return true;
  }catch(err){
    console.log(`error while sending return request : ${err.message}`);
    return false;
  }
}