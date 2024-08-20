import express from 'express';
import * as adminContoller from '../controllers/adminController.js';

import { upload } from '../services/admin/productServices.js';

const adminRouter = express.Router();

adminRouter.route('/login')
    .get(adminContoller.loginGet)
    .post(adminContoller.loginPost)

adminRouter.route('/')
    .get(adminContoller.homeGet)

// User dashboard routes
adminRouter.route('/users')
    .get(adminContoller.usersGet)
    .post(adminContoller.usersPost)

adminRouter.route('/users/form/edit')
    .get(adminContoller.edituser)
    .post(adminContoller.editPost)

adminRouter.route('/users/edit/block')
    .patch(adminContoller.editBlocked)
// User dashboard routes


// Categories dashboard routes
adminRouter.route('/categories')
    .get(adminContoller.categoriesGet)
    
adminRouter.route('/add/categories')
    .post(adminContoller.addCategoryPost)

adminRouter.route('/categories/delete')
    .get(adminContoller.deleteCategory)

adminRouter.route('/categories/add')
    .post(adminContoller.editCategoryPost)
// Categories dashboard routes

// Products dashboard routes
adminRouter.route('/products')
    .get(adminContoller.productsGet)

adminRouter.route('/products/add')
    .post(upload.array('image' , 10), adminContoller.addProducts)

adminRouter.route('/product/delete')
    .get(adminContoller.deleteProducts)


adminRouter.route('/orders')
    .get(adminContoller.ordersGet)

adminRouter.route('/coupons')
    .get(adminContoller.couponsGet)

adminRouter.route('/sales-report')
    .get(adminContoller.salesReportGet)


export default adminRouter;
