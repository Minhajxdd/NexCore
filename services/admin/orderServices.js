// Importing Model
import ordersModel from "../../models/orderSchema.js";
import userModel from "../../models/userSchema.js";
import walletModel from '../../models/walletSchema.js';

export async function getAllOrders(userId) {
  try {
    const data = await ordersModel.find().sort({ orderedAt: -1 });

    return data;
  } catch (err) {
    console.log(`error while fetching all orders: ${err.message}`);
  }
}

export async function getUsersData(userId) {
  try {
    return await userModel.findById(userId);
  } catch (err) {
    console.log(
      `error while fetching user data on orderServices: ${err.message}`
    );
  }
}

export async function updateOrderStatus(id, status) {
  try {
    await ordersModel.findByIdAndUpdate(id, {
      $set: {
        orderStatus: status,
      },
    });
    return true;
  } catch (err) {
    console.log(`error while updating data on orderServices: ${err.message}`);
    return false;
  }
}

export async function acceptOrderRequest(id, msg) {
  try {
    const orderData = await ordersModel.findByIdAndUpdate(id, {
      $set: {
        'returnRequest.request': msg
      },
    });


    if(orderData.paymentMethod !== 'Cash on Delivery'){
      
      const update = {
        $inc: { balance_amount: parseInt(orderData.totalPrice - ( orderData.coupon || 0 ) - ( orderData.offer || 0 ))},
        $push: { 
          transactions: { 
            amount: orderData.totalPrice - ( orderData.coupon || 0 ) - ( orderData.offer || 0 ), 
            transaction_type: 'credit', 
            description: `Return #${orderData._id}` 
          }
        }
      };
  
      const options = { 
        upsert: true,
        setDefaultsOnInsert: true
      };
  
      await walletModel.findOneAndUpdate(
        { user_id: orderData.user_id },
        update,
        options
      );

    }


  } catch (err) {
    console.log(`error while accepting orderrequest: ${err.message}`);
  }
}
