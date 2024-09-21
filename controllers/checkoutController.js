// Importing Services
import {
  addressIdRetreve,
  addressRetrevefromArray,
} from "../services/user/profileAddressServices.js";

// Importing modules
import Razorpay from "razorpay";
import crypto from "crypto";

// Importing Models
import cartModel from "../models/cartSchema.js";
import productModel from "../models/productSchema.js";
import addressModel from "../models/addressSchema.js";
import userModel from "../models/userSchema.js";
import orderModel from "../models/orderSchema.js";
import address from "../models/addressSchema.js";
import couponModel from "../models/couponSchema.js";

export async function getCheckout(req, res) {
  const cartId = req.session.cartId;
  let addresses = [];
  const userId = req.session.userId || req.session.passport.user;

  const addressId = await addressIdRetreve(userId);
  if (addressId.address_id.length !== 0) {
    addresses = await addressRetrevefromArray(addressId);
  }

  try {
    const cartData = await cartModel.findById(cartId);
    const productsId = cartData.items.map((item) => item.product_id);

    const products = await productModel.find({
      _id: { $in: productsId },
    });

    if (cartData.items.length === 0) {
      return res.redirect("/not-found");
    }

    res.render("pages/user/checkout.ejs", {
      products,
      cartData,
      addresses,
    });
  } catch (err) {
    console.log(`Error which get checkout data on checkout: ${err.message}`);
  }
}

export async function orderCreate(req, res) {
  const userId = req.session.userId || req.session.passport.user;

  const { paymentMethod, couponId } = req.body;
  const optionalMessage = req.body.optionalMessage || null;
  let cartData = null;

  let Addressid;
  let billName;
  if (req.body.formData) {
    try {
      const address = {
        first_name: req.body.formData.firstName,
        last_name: req.body.formData.lastName,
        company: req.body.formData.company,
        street: req.body.formData.street,
        land_mark: req.body.formData.land_mark,
        zipcode: req.body.formData.zipcode,
        city_town: req.body.formData.city_town,
        state: req.body.formData.state,
        phone_no: req.body.formData.phone_no,
        email: req.body.formData.email,
        user_id: userId,
      };
      billName = `${address.first_name} ${address.last_name}`;

      const addressData = await addressModel.create(address);
      Addressid = addressData._id;
      await userModel.findByIdAndUpdate(userId, {
        $push: { address_id: Addressid },
      });
    } catch (err) {
      console.log(`Error while creating new user on checkout: ${err.message}`);
      return res.json({
        status: "failed",
        message: err.message,
      });
    }
  }

  if (req.body.addressId) {
    Addressid = req.body.addressId;

    const {first_name, last_name} = await addressModel.findById(req.body.addressId);
    billName = `${first_name} ${last_name}`;

  }

  try {
    cartData = await cartModel.findById(req.session.cartId);
  } catch (err) {
    console.log(
      `error while fetching data from cart on checkout: ${err.message}`
    );
  }

  let couponDiscount = 0;
  if (couponId) {
    try {
      const couponData = await couponModel.findById(couponId);

      if (!couponData) {
        return res.json({
          status: false,
          message: "coupon id not found",
        });
      }

      if (cartData.totalPrice < couponData.minimumPrice) {
        return res.json({
          status: false,
          err_message: `Coupon Can be only applied for more than ${couponData.minimumPrice}`,
        });
      }

      if (couponData.limit <= 0) {
        return res.json({
          status: false,
          err_message: `Coupon limit reached`,
        });
      }

      cartData.totalPrice = cartData.totalPrice - couponData.discountPrice;

      await couponModel.findByIdAndUpdate(couponId, {
        $inc: {
          limit: -1,
        },
      });

      couponDiscount = couponData.discountPrice;
    } catch (err) {
      console.log(`error whle applying coupon coupon : ${err.message}`);
    }
  }

  const order = {
    user_id: userId,
    products: cartData.items,
    totalPrice: cartData.totalPrice,
    addressId: Addressid,
    paymentMethod: paymentMethod,
    coupon: couponDiscount,
    billName: billName
  };

  if (optionalMessage) {
    order.note = optionalMessage;
  }

  try {
    const orderData = await orderModel.create(order);
  } catch (err) {
    console.log(`error while creating order : ${err.message}`);
  }

  try {
    await cartModel.findByIdAndUpdate(req.session.cartId, {
      $set: {
        items: [],
        totalPrice: 0,
      },
    });
  } catch (err) {
    console.og(`error while clearing cart: ${err.message}`);
  }

  res.json({
    status: "success",
    redirectUrl: "/order/successfull",
    id: address._id,
  });
}

// Route to create an order
export const razorPayCreateOrder = async (req, res) => {
  // Initialize Razorpay instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const userId = req.session.userId || req.session.passport.user;

  let cartData = null;
  try {
    cartData = await cartModel.findOne({ user: userId });
  } catch (err) {
    console.log(`error while retreving cartAmount`);
    return;
  }

  if (!cartData) {
    return res.json({
      status: "failed",
      message: "amount not found",
    });
  }

  let { totalPrice: amount } = cartData;

  const options = {
    amount: amount * 100, // Razorpay expects the amount in the smallest currency unit (e.g., 100 = 1 INR)
    currency: "INR", // e.g., 'INR'
    receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`, // Unique receipt ID
  };

  try {
    const order = await razorpay.orders.create(options); // Create an order using Razorpay API
    order.key_id = process.env.RAZORPAY_KEY_ID;
    res.json(order); // Send the order details back to the client
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" }); // Error handling
  }
};

export const conformPaymentRazorPay = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body; // Retrieve payment details from the request body

  const body = razorpay_order_id + "|" + razorpay_payment_id; // Concatenate order_id and payment_id for signature verification

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex"); // Create the expected signature using HMAC SHA256 and the key secret

  if (expectedSignature === razorpay_signature) {
    return res.json({
      success: true,
      message: "Payment verified successfully",
    }); // Success if signatures match
  }

  res
    .status(400)
    .json({ success: false, message: "Payment verification failed" }); // Failure if signatures don't match
};

export async function orderSuccessfullGet(req, res) {
  res.render("pages/user/orderSuccessfull.ejs");
}

export async function authCoupon(req, res) {
  const { coupon } = req.body;
  const cartId = req.session.cartId;

  if (!coupon) {
    return res.json({
      status: false,
      err_message: "Enter Valid Coupon!",
    });
  }

  try {
    const couponData = await couponModel.findOne({ couponCode: coupon });

    if (!couponData) {
      return res.json({
        status: false,
        err_message: "No coupon Found!",
      });
    }

    if(couponData.isDeleted){
      return res.json({
        status: false,
        err_message: 'Coupon Not Found'
      })
    }

    const cartData = await cartModel.findById(cartId);

    if (cartData.totalPrice < couponData.minimumPrice) {
      return res.json({
        status: false,
        err_message: `Coupon Can be only applied for more than ${couponData.minimumPrice}`,
      });
    }

    if (couponData.limit <= 0) {
      return res.json({
        status: false,
        err_message: `Coupon limit reached`,
      });
    }

    const couponResponse = {
      id: couponData._id,
      discountPrice: couponData.discountPrice,
    };

    couponResponse.couponPrice = cartData.totalPrice - couponData.discountPrice;

    return res.json({
      status: true,
      couponResponse,
    });
  } catch (err) {
    console.log(`error while applying coupon: ${err.message}`);
    return res.json({
      status: false,
      message: "something went wrong",
    });
  }
}
