import express from 'express';
import noCache,* as authController from '../controllers/authController.js';
import * as users from '../controllers/usserController.js';

const router = express.Router();

// Authentication
router.route('/login')
    .get(noCache, authController.loginGet)
    .post(noCache, authController.loginPost)
  
router.route('/signup')
    .get(noCache, authController.signupGet)
    .post(noCache, authController.signupPost)
    
router.route('/otp')
    .get(noCache, authController.getOtp)
    
router.route('/otp/verify')
    .post(noCache, authController.postOtp)

router.route('/otp/re-sent')
    .get(noCache, authController.reSendOtp)

router.route('/password_reset')
    .get(noCache, authController.resentEmailOtp)
    .post(noCache, authController.resentEmailOtpPost)

router.route('/password_resent/otp')
    .get(noCache, authController.resentOtpOtp)
    .post(noCache, authController.resentOtpOtpPost)

router.route('/auth/google')
    .get(authController.googleAuth)

router.route('/auth/google/callback')
    .get(authController.googleCallback)

router.route('/auth/protected')
    .get(authController.protectedRoute)

router.route('/auth/google/failure')
    .get(authController.googleFailure)

router.route('/logout')
    .all(noCache, authController.logout)
    
// Authentication



// Pages
router.route('/')
    .get(noCache, users.homeGet)


router.route('/product')
    .get(users.productGet);





router.route('*')
    .all(authController.NotFound);

export default router;