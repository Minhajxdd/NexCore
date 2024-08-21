import express from 'express';
import * as authController from '../controllers/authController.js';
import * as users from '../controllers/usserController.js';

const router = express.Router();


router.route('/login')
    .get(authController.loginGet)
    .post(authController.loginPost)
  
router.route('/signup')
    .get(authController.signupGet)
    .post(authController.signupPost)
    
router.route('/otp')
    .get(authController.getOtp)
    
router.route('/otp/verify')
    .post(authController.postOtp)
    



router.route('/')
    // .get(userController.logRedirect, userController.homeGet)
    .get(users.homeGet);

router.route('/product')
    .get(users.productGet);



export default router;