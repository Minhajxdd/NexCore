import express from 'express';
import * as adminContoller from '../controllers/adminController.js';


const adminRouter = express.Router();

adminRouter.route('/')
    .get(adminContoller.loginGet)


export default adminRouter;
