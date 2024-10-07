// Importing Services functions

import {
  createUser,
  getUsers,
  axiosIdFetch,
  userEdit,
  updateIsBlocked,
} from "../services/admin/usersServices.js";

import {
  createCategory,
  getCategory,
  updateDeleted,
  editCategory,
  checkDuplicateCategory,
} from "../services/admin/categoryServices.js";

import {
  getCategoryDetails,
  createProduct,
  getProducts,
  updateDeletedProduct,
  updateProductStock,
  oneProductDetails,
  editProduct,
} from "../services/admin/productServices.js";

import {
  getAllOrders,
  getUsersData,
  updateOrderStatus,
  acceptOrderRequest,
  getOrderDetails,
} from "../services/admin/orderServices.js";

import {
  createCoupon,
  checkDupeCoupon,
  getAllCoupons,
  editCoupon,
  deleteCoupon,
} from "../services/admin/couponServices.js";

import { sreportFilter } from "../services/admin/s-reportServices.js";

import {
  offerGetType,
  createOffer,
  existCouponName,
  getOffers,
  updateOfferStatus,
} from "../services/admin/offerServices.js";

import {
  getDashboardData,
  productChartData,
  categoryChartData,
} from "../services/admin/dashboardServices.js";

export const loginGet = (req, res) => {
  if (req.query) {
    const err = Number(req.query.err);
    switch (err) {
      case 1:
        return res.render("pages/admin/admin_login", {
          alertMessage: "user name or password not found!!",
        });
    }
  }

  if(req.session.admin) {
    return res.redirect("/admin");
  }

  res.render("pages/admin/admin_login", { alertMessage: "" });
};

export const loginPost = (req, res) => {
  const { uname, password } = req.body;
  if (uname === process.env.ADMINUNAME && password === process.env.ADMINPASS) {
    req.session.admin = uname;
    return res.redirect("/admin");
  }

  res.redirect("/admin/login?err=1");
};

export const homeGet = async (req, res) => {
  // Function to get the dashborad top data;
  const data = await getDashboardData();

  res.render(`pages/admin/dashboard`, { data });
};

export const dashboardCharData = async function (req, res) {
  const { type } = req.params;

  if (type === `product-data`) {
    const { time } = req.query;

    if (!time) {
      return res.json({
        status: false,
        message: "time zone not specified",
      });
    }

    const productData = await productChartData(time);

    return res.json({
      status: true,
      message: `successfully fetched data`,
      productData,
    });
  } else if (type === `category-data`) {
    const { time } = req.query;

    if (!time) {
      return res.json({
        status: false,
        message: "time zone not specified",
      });
    }

    const categoryData = await categoryChartData(time);

    return res.json({
      status: true,
      message: `successfully fetched data`,
      categoryData,
    });
  }
};

// Admin User Dashboard Controllers
export const usersGet = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 5;
  const uname = req.query.usr || '';

  
  const { users, next, previous } = await getUsers(page, limit, uname);

  res.render(`pages/admin/user`, {
    users,
    next,
    previous
  });
};

export const usersPost = async (req, res) => {
  await createUser(req.body);
  res.redirect("/admin/users");
};

export const edituser = async (req, res) => {
  const data = await axiosIdFetch(req.query.id);
  res.json(data);
};

export const editPost = async (req, res) => {
  await userEdit(req.body);
  res.redirect("/admin/users");
};

export const editBlocked = async (req, res) => {
  updateIsBlocked(req.body.id);
  res.json({
    status: "success",
    message: "updated successfully",
  });
};
// Admin User Dashboard Controllers

// Admin Categories Dashboard Controllers
export async function categoriesGet(req, res) {
  const page = req.query.page || 1;
  const limit = 5;

  const { data, next, previous} = await getCategory(page, limit);
  res.render("pages/admin/categories", { data, next, previous });
}

export async function addCategoryPost(req, res) {
  if (await checkDuplicateCategory(req.body.name)) {
    await createCategory(req.body);
    const data = await getCategory();
    return res.json({ data });
  }

  return res.json({
    data: {
      status: "failed",
      message: "something went wrong",
      dupe: "Duplicate Name Found",
    },
  });
}

export async function deleteCategory(req, res) {
  await updateDeleted(req.query.id);
  res.json({
    status: "success",
    message: "successfully updated",
  });
}

export async function editCategoryPost(req, res) {
  if (await checkDuplicateCategory(req.body.name)) {
    const data = await editCategory(req.body);
    return res.json(data);
  }

  return res.json({
    data: {
      status: "failed",
      message: "something went wrong",
      dupe: "Duplicate Name Found",
    },
  });
}

// Admin Categories Dashboard Controllers

// Admin Product Dashboard Controllers
export async function productsGet(req, res) {
  const page = req.query.page || 1;
  const limit = 5;

  const categories = await getCategoryDetails();
  const {products, next, previous} = await getProducts(page, limit);

  res.render(`pages/admin/product`, {
    categories,
    products,
    next,
    previous
  });
}

export async function addProducts(req, res) {
  const productData = await createProduct(
    req.body,
    req.query.cat_id,
    req.files
  );

  const result = {};
  result.product_details = productData;
  result.status = "Success";

  res.json(result);
}

export async function deleteProducts(req, res) {
  await updateDeletedProduct(req.query.id);
  res.json({ status: "success" });
}

export async function updateStock(req, res) {
  const { action, id } = req.query;
  if (action == "add") {
    updateProductStock(id, 1);
    return res.json({
      status: "success",
      message: "stock incremented successfully",
    });
  }

  updateProductStock(id, -1);
  return res.json({
    status: "success",
    message: "stock decremented successfully",
  });
}

export async function getProductDetails(req, res) {
  const productData = await oneProductDetails(req.query.id);
  res.json(productData);
}

export async function productEdit(req, res) {
  const updateData = await editProduct(req.body, req.files);

  if (!updateData) {
    return res.json({
      status: false,
      message: "somethign went wrong",
    });
  }

  return res.json({
    status: true,
    updateData,
  });
}

// Admin Product Dashboard Controllers

// Admin Orders Dashboard Controllers
export const ordersGet = async (req, res) => {

  const page = req.query.page || 1;
  const limit = 10;

  const { orders, next, previous} = await getAllOrders(page, limit);


  const users = await Promise.all(
    orders.map(async (order) => {
      return await getUsersData(order.user_id);
    })
  );

  res.render(`pages/admin/orders`, {
    orders,
    users,
    next,
    previous
  });
};

export async function orderUpdateStatus(req, res) {
  if (updateOrderStatus(req.body.id, req.body.status)) {
    return res.json({
      status: "succes",
      message: "status updated successfully",
    });
  }
  return res.json({
    status: "failed",
    message: "error while updating successfully",
  });
}

export async function adminOrderAction(req, res) {
  try {
    const { id } = req.body;
    const { action } = req.params;

    if (!id) {
      return res.json({
        status: false,
        message: `order id not found`,
      });
    }

    if (action === "accept") {
      await acceptOrderRequest(id, "accepted");
    } else if (action === "reject") {
      await acceptOrderRequest(id, "rejected");
    }

    return res.json({
      status: true,
      message: "request accepted successfully",
    });
  } catch (err) {
    console.log(`Error while acceptingOrderReturn : ${err.message}`);
    return res.json({
      status: false,
      message: "error while accepting return order",
    });
  }
}

export async function apiOrderProducts(req, res) {
  if (!req.body.orderId) {
    return res.json({
      status: false,
      message: `orderID not found`,
    });
  }

  const data = await getOrderDetails(req.body.orderId);

  if (!data) {
    return res.json({
      status: false,
      message: `something went wrong`,
    });
  }

  return res.json({
    status: true,
    message: `successfully fetched`,
    data,
  });
}

// Admin Orders Dashboard Controllers

// Admin Coupons Dashboard Controllers

export const couponsGet = async (req, res) => {
  const coupons = await getAllCoupons();

  res.render(`pages/admin/coupons`, {
    coupons,
  });
};

export const apiAddCoupon = async (req, res) => {
  if (!(await checkDupeCoupon(req.body.cpCode))) {
    console.log("errormessage");
    return res.json({
      status: "failed",
      err_message: "Coupon Code Already Exists!",
    });
  }

  await createCoupon(req.body);

  return res.json({
    status: "success",
    message: "new coupon successfully created",
  });
};

export const apiEditCoupon = async (req, res) => {
  if (await editCoupon(req.body)) {
    return res.json({
      status: "success",
      message: "successfully edited Coupon",
    });
  }

  return res.json({
    status: "failed",
    message: "error wile editing coupon",
  });
};

export const apiDeleteCoupon = async (req, res) => {
  if (req.query.id) {
    await deleteCoupon(req.query.id);
  }

  return res.json({
    status: "success",
    message: "Update Successfully",
  });
};
// Admin Coupons Dashboard Controllers

// Admin Offer Dashboard Controllers

export const offerGet = async (req, res) => {
  const offers = await getOffers();

  res.render(`pages/admin/offers`, {
    offers,
  });
};

export const offerType = async function (req, res) {
  if (!req.query.type) {
    return res.json({
      status: false,
      message: `type query not found`,
    });
  }
  const data = await offerGetType(req.query.type);

  return res.json({
    status: true,
    message: `successfully data fetched`,
    data,
  });
};

export const addOffer = async function (req, res) {
  if (await existCouponName(req.body.title)) {
    return res.json({
      status: false,
      err_message: "Offer Title Exists",
    });
  }

  const data = await createOffer(req.body);
  console.log(data);
  if (data) {
    return res.json({
      status: true,
      message: `user created succesfully`,
      data,
    });
  }
};

export const toggleActivate = async function (req, res) {
  const { id } = req.query;

  if (!id) {
    return res.json({
      status: false,
      message: `Id Note Found`,
    });
  }

  await updateOfferStatus(id);

  return res.json({
    status: true,
    message: `offere status update`,
  });
};

// Admin Offer Dashboard Controllers

// Admin Sales Report Dashboard Controllers
export const salesReportGet = (req, res) => {
  res.render(`pages/admin/s-report`);
};

export const salesReportApi = async function (req, res) {
  let data = null;

  if (req.body.sDate && req.body.eDate) {
    data = await sreportFilter(req.body.by, req.body.sDate, req.body.eDate);
  } else {
    data = await sreportFilter(req.body.by);
  }

  if (!data) {
    return res.json({
      status: false,
      message: `Data not found`,
    });
  }

  return res.json({
    status: true,
    message: `successfuly fetched data`,
    data,
  });
};

// Admin Sales Report Dashboard Controllers

function authenticate(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  res.redirect("/admin/login");
}

export default authenticate;
