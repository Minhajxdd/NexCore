import express from 'express';
import * as adminContoller from '../controllers/adminController.js';


const adminRouter = express.Router();

adminRouter.route('/login')
    .get(adminContoller.loginGet)
    .post(adminContoller.loginPost)

adminRouter.route('/')
    .get(adminContoller.homeGet)

adminRouter.route('/users')
    .get(adminContoller.usersGet)
    .post(adminContoller.usersPost)

adminRouter.route('/products')
    .get(adminContoller.productsGet)

adminRouter.route('/orders')
    .get(adminContoller.ordersGet)

adminRouter.route('/coupons')
    .get(adminContoller.couponsGet)

adminRouter.route('/sales-report')
    .get(adminContoller.salesReportGet)


export default adminRouter;
