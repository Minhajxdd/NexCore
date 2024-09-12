import express from 'express';
import authenticate,* as adminContoller from '../controllers/adminController.js';
import { NotFound, adminLogout } from '../controllers/authController.js';

import { upload } from '../services/admin/productServices.js';

const adminRouter = express.Router();

adminRouter.route('/login')
    .get(adminContoller.loginGet)
    .post(adminContoller.loginPost)

adminRouter.route('/logout')
    .get(adminLogout)


adminRouter.route('/')
    .get(authenticate, adminContoller.homeGet)

// User dashboard routes
adminRouter.route('/users')
    .get(authenticate, adminContoller.usersGet)
    .post(authenticate, adminContoller.usersPost)

adminRouter.route('/users/form/edit')
    .get(authenticate, adminContoller.edituser)
    .post(authenticate, adminContoller.editPost)

adminRouter.route('/users/edit/block')
    .patch(authenticate, adminContoller.editBlocked)
// User dashboard routes


// Categories dashboard routes
adminRouter.route('/categories')
    .get(authenticate, adminContoller.categoriesGet)
    
adminRouter.route('/add/categories')
    .post(authenticate, adminContoller.addCategoryPost)

adminRouter.route('/categories/delete')
    .get(authenticate, adminContoller.deleteCategory)

adminRouter.route('/categories/add')
    .post(authenticate, adminContoller.editCategoryPost)
// Categories dashboard routes

// Products dashboard routes
adminRouter.route('/products')
    .get(authenticate, adminContoller.productsGet)

adminRouter.route('/products/add')
    .post(upload.array('image' , 10), adminContoller.addProducts)

adminRouter.route('/product/delete')
    .get(authenticate, adminContoller.deleteProducts)

adminRouter.route('/api/admin/product/stock')
    .get(adminContoller.updateStock)

adminRouter.route('/api/product/get-product')
    .get(adminContoller.getProductDetails)
// Products dashboard routes

// Products order routes

adminRouter.route('/orders')
    .get(authenticate, adminContoller.ordersGet)

adminRouter.route('/api/orders/status-update')
    .post(adminContoller.orderUpdateStatus);

// Products order routes

// Coupon Dashboard routes

adminRouter.route('/coupons')
    .get(authenticate, adminContoller.couponsGet)

adminRouter.route('/api/coupon/add')
    .post(authenticate, adminContoller.apiAddCoupon)

// Coupon Dashboard routes


adminRouter.route('/sales-report')
    .get(authenticate, adminContoller.salesReportGet)


// adminRouter.route('*')
//     .all(NotFound)

export default adminRouter;
