// Importing Services
import {
  addressIdRetreve,
  addressRetrevefromArray,
  deleteAddress,
  updateAddressFun,
} from "../services/user/profileAddressServices.js";
import {
  ordersDetails,
  getProductDetails,
  getAddressIdAndUser,
  addressDetailsGet,
  orderCancel,
  sendReturnRequest,
  validateOrder,
} from "../services/user/profileOrdersServices.js";

export function profileGet(req, res) {
  res.render("pages/user/profile.ejs");
}

// Addresss

export async function addressGet(req, res) {
  const userId = req.session.userId || req.session.passport.user;

  try {
    const addressId = await addressIdRetreve(userId);
    const addresses = await addressRetrevefromArray(addressId);
    res.render("pages/user/address", {
      addresses,
    });
  } catch (err) {
    console.log(`error while address get :${err.message}`);
  }
}

export async function deleteAddess(req, res) {
  try {
    await deleteAddress(req.query.id);

    return res.json({
      status: "success",
      message: "successfully deleted",
    });
  } catch (err) {
    console.log(`error while deleting address ${err.message}`);
    return res.json({
      status: "failed",
      message: "failed on deletion",
    });
  }
}

export async function updateAddress(req, res) {
  const { formData, id } = req.body;

  const result = {};

  result.data = await updateAddressFun(formData, id);

  result.status = "success";

  res.json(result);
}

// Address

// Orders

export async function ordersGet(req, res) {
  const userId = req.session.userId || req.session.passport.user;
  try {
    const orders = await ordersDetails(userId);

    const productDetails = [];

    await Promise.all(
      orders.map(async (obj, indx) => {
        productDetails.push({});

        const products = await Promise.all(
          obj.products.map(async (innerObj) => {
            const temp = await getProductDetails(innerObj.product_id);
            return temp;
          })
        );

        productDetails[indx].products = products;
      })
    );

    res.render("pages/user/orders", {
      orders,
      productDetails,
    });
  } catch (err) {
    console.log(`error while rendering address`);
  }
}

export async function orderDetailsGet(req, res) {
  const userId = req.session.userId || req.session.passport.user;

  if (!req.query.id) {
    return res.redirect("/not-found");
  }

  const [orders] = await getAddressIdAndUser(req.query.id, userId);

  if (Object.keys(orders).length === 0) {
    return res.redirect("/not-found");
  }

  const products = await Promise.all(
    orders.products.map(async (val) => {
      return await getProductDetails(val.product_id);
    })
  );

  const address = await addressDetailsGet(orders.addressId);

  res.render("pages/user/orderDetails", {
    orders,
    products,
    address,
  });
}

export async function cancelOrderApi(req, res) {
  if (orderCancel(req.query.id)) {
    return res.json({
      status: "success",
      message: "order cancelled successfully",
      orderStatus: "cancelled",
    });
  } else {
    return res.json({
      status: "failed",
      message: "order cancellation failed",
    });
  }
}

export async function returnRequestOrderApi(req, res) {
  const { id } = req.body;
  if(!await validateOrder(id)){
    return res.json({
      status: false,
      message: 'Order not found'
    })
  };

  try {
    await sendReturnRequest(req.body);

    return res.json({
      status: true,
      message: "successfully request sent",
    });

  } catch (err) {
    console.log(`error while sending request on order api: ${err.message}`);
    return res.json({
      status: false,
      message: "error while sending request",
    });
  }
}

// Orders

// Wallet

export async function getWallet(req, res){
  res.render("pages/user/wallet.ejs");
}

// Wallet