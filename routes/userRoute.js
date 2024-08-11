import express from 'express';
import * as userController from '../controllers/userController.js';


const router = express.Router();


router.route('/login')
    .get(userController.loginGet);

router.route('/')
    .get(userController.homeGet);

router.route('/signup')
    .get(userController.signupGet);

router.route('/otp')
    .get(userController.getOtp);


export default router; 