import express from 'express';
import * as authController from '../controllers/authController.js';
import * as users from '../controllers/usserController.js';

const router = express.Router();

// Authentication
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
    
router.route('/auth/google')
    .get(authController.googleAuth)

router.route('/auth/google/callback')
    .get(authController.googleCallback)

router.route('/auth/protected')
    .get(authController.protectedRoute)

router.route('/auth/google/failure')
    .get(authController.googleFailure)

router.route('/logout')
    .all(authController.logout)
    
// Authentication



// Pages
router.route('/')
    .get(users.homeGet)


router.route('/product')
    .get(users.productGet);





router.route('*')
    .all(authController.NotFound);

export default router;