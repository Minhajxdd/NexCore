// Importing Model
import addressModel from "../../models/addressSchema.js";
import ordersModel from "../../models/orderSchema.js";
import productModel from "../../models/productSchema.js";
import userModel from "../../models/userSchema.js";
import walletModel from "../../models/walletSchema.js";

export async function getAllOrders(page, limit) {
  try {
    const startIndex = (page - 1) * limit;

    const result = {};

    result.orders = await ordersModel
      .find({
        paymentMethod: {
          $ne: "Failed Payment",
        },
      })
      .sort({ orderedAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .lean();

      if (result.orders.length === limit) {
        result.next = {
          page: Number(page) + 1,
          limit: limit,
        };
        
      } else {
          result.next = {
              page: page,
              limit: limit,
          }
      }
  
      if (startIndex > 0) {
        result.previous = {
          page: page - 1,
          limit: limit,
        };
      } else {
          result.previous = {
              page: 1,
              limit: limit,
          }
      }
  


    return result;
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
        "returnRequest.request": msg,
      },
    });

    if (orderData.paymentMethod !== "Cash on Delivery") {
      const update = {
        $inc: {
          balance_amount: parseInt(
            orderData.totalPrice -
              (orderData.coupon || 0) -
              (orderData.offer || 0)
          ),
        },
        $push: {
          transactions: {
            amount:
              orderData.totalPrice -
              (orderData.coupon || 0) -
              (orderData.offer || 0),
            transaction_type: "credit",
            description: `Return #${orderData._id}`,
          },
        },
      };

      const options = {
        upsert: true,
        setDefaultsOnInsert: true,
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

export async function getOrderDetails(id = null) {
  try {
    const orderData = await ordersModel
      .findById(id, {
        returnRequest: 0,
        _id: 0,
        user_id: 0,
        __v: 0,
      })
      .lean();

    if (!orderData) return null;

    const productsId = orderData.products.map((item) => item.product_id);

    if (!productsId || productsId.length === 0) return null;

    const products = await productModel
      .find(
        {
          _id: { $in: productsId },
        },
        {
          name: 1,
          description: 1,
          images: 1,
          discounted_price: 1,
          category_name: 1,
          stock: 1,
        }
      )
      .lean();

    orderData.productsDetail = products;

    const address = await addressModel
      .findById(orderData.addressId, {
        _id: 0,
        user_id: 0,
        isDeleted: 0,
        created_at: 0,
        __v: 0,
      })
      .lean();

    orderData.address = address;

    delete orderData.addresssId;

    return orderData;
  } catch (err) {
    console.log(`error while fetching order details: ${err.message}`);
  }
}
