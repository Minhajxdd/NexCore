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
    .post(authController.signupPost)
    
router.route('/otp')
    .get(noCache, authController.getOtp)
    
router.route('/otp/verify')
    .post(authController.postOtp)

router.route('/otp/re-sent')
    .get(authController.reSendOtp)

router.route('/password_reset')
    .get(authController.resentEmailOtp)

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