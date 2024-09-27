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
import offerModel from "../models/offerSchema.js";
import walletModel from "../models/walletSchema.js";

// Get Checkout Details
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

    const products = await productModel
      .find({
        _id: { $in: productsId },
      })
      .lean();

    if (cartData.items.length === 0) {
      return res.redirect("/not-found");
    }

    for (const product of products) {
      const [data] = await offerModel
        .find(
          {
            $or: [
              {
                offer_type: "Products",
                offer_available: { $in: product._id },
                isDeleted: false,
              },
              {
                offer_type: "Category",
                offer_available: { $in: product.category },
                isDeleted: false,
              },
            ],
          },
          {
            exp_date: 0,
            isDeleted: 0,
            createdAt: 0,
            updatedAt: 0,
            offer_available: 0,
            offer_type: 0,
            _id: 0,
            offer_title: 0,
            __v: 0,
          }
        )
        .sort({ discount_percentage: -1 })
        .limit(1);

      if (data) {
        products.offer = 0;
        products.offer +=
          product.discounted_price -
          (product.discounted_price -
            product.discounted_price * (data.discount_percentage / 100));
      }
    }

    const shipping = calculateShipping(
      cartData.totalPrice - products.offer || 0
    );

    res.render("pages/user/checkout.ejs", {
      products,
      cartData,
      addresses,
      shipping,
    });
  } catch (err) {
    console.log(`Error which get checkout data on checkout: ${err.message}`);
  }
}
// Get Checkout Details

// Delivery charge Calculate
function calculateShipping(price) {
  if (price < 1000) {
    return 50;
  } else if (price > 1000 && price <= 10000) {
    return 200;
  } else {
    return 0;
  }
}
// Delivery charge Calculate

// Order create
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

    const { first_name, last_name } = await addressModel.findById(
      req.body.addressId
    );
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

  if (cartData.totalPrice > 1000 && paymentMethod === "Cash on Delivery") {
    return res.json({
      status: false,
      err_message: `Order About 1000 is not Applicable for COD!`,
    });
  }

  if (cartData.items.length === 0) {
    return res.redirect("/not-found");
  }

  const productsId = cartData.items.map((item) => item.product_id);

  const products = await productModel
    .find({
      _id: { $in: productsId },
    })
    .lean();

  for (const product of products) {
    const [data] = await offerModel
      .find(
        {
          $or: [
            {
              offer_type: "Products",
              offer_available: { $in: product._id },
              isDeleted: false,
            },
            {
              offer_type: "Category",
              offer_available: { $in: product.category },
              isDeleted: false,
            },
          ],
        },
        {
          exp_date: 0,
          isDeleted: 0,
          createdAt: 0,
          updatedAt: 0,
          offer_available: 0,
          offer_type: 0,
          _id: 0,
          offer_title: 0,
          __v: 0,
        }
      )
      .sort({ discount_percentage: -1 })
      .limit(1);

    if (data) {
      products.offer = 0;
      products.offer +=
        product.discounted_price -
        (product.discounted_price -
          product.discounted_price * (data.discount_percentage / 100));
    }
  }

  const shipping = calculateShipping(cartData.totalPrice - products.offer || 0);

  cartData.totalPrice = parseInt(
    cartData.totalPrice - (products.offer || 0) + shipping
  );

  if (paymentMethod === "Wallet") {
    try {
      const update = {
        $inc: { balance_amount: -cartData.totalPrice },
        $push: {
          transactions: {
            amount: cartData.totalPrice,
            transaction_type: "debit",
            description: `Order`,
          },
        },
      };

      const options = {
        upsert: true,
        setDefaultsOnInsert: true,
      };

      await walletModel.findOneAndUpdate({ user_id: userId }, update, options);
    } catch (err) {
      return console.log(`error while deducting: ${err.message}`);
    }
  }

  const order = {
    user_id: userId,
    products: cartData.items,
    totalPrice: cartData.totalPrice,
    addressId: Addressid,
    paymentMethod: paymentMethod,
    coupon: couponDiscount,
    offer: products.offer,
    billName: billName,
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

  if (paymentMethod === "Failed Payment") {
    return res.json({
      status: "success",
      redirectUrl: "/order/payment-failed",
      id: address._id,
    });
  }

  return res.json({
    status: "success",
    redirectUrl: "/order/successfull",
    id: address._id,
  });
}
// Order create

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

  const productsId = cartData.items.map((item) => item.product_id);

  const products = await productModel
    .find({
      _id: { $in: productsId },
    })
    .lean();

  if (cartData.items.length === 0) {
    return res.redirect("/not-found");
  }

  for (const product of products) {
    const [data] = await offerModel
      .find(
        {
          $or: [
            {
              offer_type: "Products",
              offer_available: { $in: product._id },
              isDeleted: false,
            },
            {
              offer_type: "Category",
              offer_available: { $in: product.category },
              isDeleted: false,
            },
          ],
        },
        {
          exp_date: 0,
          isDeleted: 0,
          createdAt: 0,
          updatedAt: 0,
          offer_available: 0,
          offer_type: 0,
          _id: 0,
          offer_title: 0,
          __v: 0,
        }
      )
      .sort({ discount_percentage: -1 })
      .limit(1);

    if (data) {
      products.offer = 0;
      products.offer +=
        product.discounted_price -
        (product.discounted_price -
          product.discounted_price * (data.discount_percentage / 100));
    }
  }

  const shipping = calculateShipping(cartData.totalPrice - products.offer || 0);

  amount = cartData.totalPrice - (products.offer || 0) + shipping;

  const { couponId } = req.query;

  if (couponId !== "null") {
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
    amount = amount - couponData.discountPrice;
  }

  amount = Math.floor(amount);

  const options = {
    amount: amount, // Razorpay expects the amount in the smallest currency unit (e.g., 100 = 1 INR)
    currency: "INR", // e.g., 'INR'
    receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`, // Unique receipt ID
  };

  try {
    const order = await razorpay.orders.create(options); // Create an order using Razorpay API
    order.key_id = process.env.RAZORPAY_KEY_ID;
    res.json(order); // Send the order details back to the client
  } catch (error) {
    console.log("Failed to create order ", error);
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
    if (req.body.orderId) {
      return res.redirect(
        `/api/orders/razor/conform?orderId=${req.body.orderId}`
      );
    }

    return res.json({
      success: true,
      message: "Payment verified successfully",
    }); // Success if signatures match
  }

  res
    .status(400)
    .json({ success: false, message: "Payment verification failed" }); // Failure if signatures don't match
};

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

    if (couponData.isDeleted) {
      return res.json({
        status: false,
        err_message: "Coupon Not Found",
      });
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

// check Is there Price in wallet
export async function checkWalletBalance(req, res) {
  const userId = req.session.userId || req.session.passport.user;

  const { paymentMethod, couponId } = req.body;

  if (paymentMethod !== "Wallet") {
    return res.json({
      status: false,
      message: "Invalid Payment Method",
    });
  }

  // Retreving cartdata
  let cartData = null;
  try {
    cartData = await cartModel.findById(req.session.cartId);
  } catch (err) {
    console.log(
      `error while fetching data from cart on checkout: ${err.message}`
    );
  }
  // Retreving cartdata

  // Valid and reduce coupon price
  if (couponId) {
    try {
      const couponData = await couponModel.findById(couponId);

      if (
        !couponData ||
        cartData.totalPrice < couponData.minimumPrice ||
        couponData.limit <= 0
      ) {
        return res.json({
          status: false,
          message: "Invalid Coupon",
        });
      }

      cartData.totalPrice = cartData.totalPrice - couponData.discountPrice;
    } catch (err) {
      console.log(`error whle applying coupon coupon : ${err.message}`);
    }
  }
  // Valid and reduce coupon price

  if (cartData.items.length === 0) {
    return res.redirect("/not-found");
  }

  // Check for offers and reduce the price
  const productsId = cartData.items.map((item) => item.product_id);

  const products = await productModel
    .find({
      _id: { $in: productsId },
    })
    .lean();

  for (const product of products) {
    const [data] = await offerModel
      .find(
        {
          $or: [
            {
              offer_type: "Products",
              offer_available: { $in: product._id },
              isDeleted: false,
            },
            {
              offer_type: "Category",
              offer_available: { $in: product.category },
              isDeleted: false,
            },
          ],
        },
        {
          exp_date: 0,
          isDeleted: 0,
          createdAt: 0,
          updatedAt: 0,
          offer_available: 0,
          offer_type: 0,
          _id: 0,
          offer_title: 0,
          __v: 0,
        }
      )
      .sort({ discount_percentage: -1 })
      .limit(1);

    if (data) {
      products.offer = 0;
      products.offer +=
        product.discounted_price -
        (product.discounted_price -
          product.discounted_price * (data.discount_percentage / 100));
    }
  }
  // Check for offers and reduce the price

  const shipping = calculateShipping(cartData.totalPrice - products.offer || 0);

  const finalPrice = cartData.totalPrice - (products.offer || 0) + shipping;

  try {
    const walletData = await walletModel
      .findOne(
        {
          user_id: userId,
        },
        {
          _id: 0,
          __v: 0,
          created_at: 0,
          transactions: 0,
          user_id: 0,
        }
      )
      .lean();

    if (!walletData) {
      return res.json({
        status: false,
        err_message: "Insufficient wallet balance",
      });
    }

    const { balance_amount } = walletData;

    if (finalPrice > balance_amount) {
      return res.json({
        status: false,
        err_message: "Insufficient wallet balance",
      });
    }
  } catch (err) {
    console.log(`error while checking wallet: ${err.message}`);
  }

  return res.json({
    status: true,
    message: "Proceed with the next step",
  });
}
// check Is there Price in wallet

// Conform Page
export async function orderSuccessfullGet(req, res) {
  res.render("pages/user/orderSuccessfull.ejs");
}
// Conform Page
// Payment Failed Page
export async function paymetFailedGet(req, res) {
  res.render("pages/user/orderFailed.ejs");
}
// Payment Failed Page

export async function retryRazorPayCreate(req, res) {
  const userId = req.session.userId || req.session.passport.user;
  const { orderId } = req.body;

  try {
    var { totalPrice } = await orderModel
      .findOne(
        {
          _id: orderId,
          user_id: userId,
          paymentMethod: "Failed Payment",
        },
        {
          totalPrice: 1,
          _id: 0,
        }
      )
      .lean();

    if (!totalPrice) {
      res.status(500).json({ error: "Failed to create order" });
    }
  } catch (err) {
    console.log(`error while fetching order data: ${err.message}`);
  }

  // Initialize Razorpay instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: totalPrice, // Razorpay expects the amount in the smallest currency unit (e.g., 100 = 1 INR)
    currency: "INR", // e.g., 'INR'
    receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`, // Unique receipt ID
  };

  try {
    const order = await razorpay.orders.create(options); // Create an order using Razorpay API
    order.key_id = process.env.RAZORPAY_KEY_ID;
    res.json(order); // Send the order details back to the client
  } catch (error) {
    console.log("Failed to create order ", error);
    res.status(500).json({ error: "Failed to create order" }); // Error handling
  }
}

// Conform Failed Payment
export async function conformFailedPayment(req, res) {
  const orderId = req.query.orderId;
  try {
    await orderModel.findByIdAndUpdate(
      {
        _id: orderId,
      },
      {
        $set: {
          paymentMethod: `Razer Pay`,
        },
      }
    );

    return res.json({
      success: true,
      message: `successfully payment completed`,
    });
  } catch (err) {
    console.log(`error while conforming faile order: ${err.message}`);
    return res.json({ status: false });
  }
}
// Conform Failed Payment
