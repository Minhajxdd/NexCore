import express from 'express';
import * as adminContoller from '../controllers/adminController.js';


const adminRouter = express.Router();

adminRouter.route('/login')
    .get(adminContoller.loginGet)
    .post(adminContoller.loginPost)


export default adminRouter;
