import express from 'express';
import noCache,* as authController from '../controllers/authController.js';
import * as users from '../controllers/usserController.js';
import * as carts from '../controllers/cartController.js';
import * as category from '../controllers/categoryController.js';
import * as search from '../controllers/searchController.js';
import * as checkout from '../controllers/checkoutController.js';
import * as profile from '../controllers/profileController.js';

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


// Cart Routes
router.route('/cart')
    .get(carts.cartGet)

router.route('/cart/product/add')
    .post(carts.addCartProducts);

router.route('/cart/product/quantity/increase')
    .post(carts.productQuantityInc)

router.route('/cart/product/quantity/decrease')
    .post(carts.productQuantityDec)

router.route('/cart/product/delete')
    .post(carts.deleteCartProduct)

// Cart Routes

// Categories
router.route('/categories/:name')
    .get(category.categoryGet)

router.route('/api/categories/:name')
    .get(category.categoryFilter)
// Categories


// Search

router.route('/search')
    .get(search.searchGet);

router.route('/api/search')
    .post(search.searchApi);

// Search

// Checkout

router.route('/checkout')
    .get(checkout.getCheckout);

router.route('/order/authenticate')
    .post(checkout.orderAuthenticate);

router.route('/order/successfull')
    .get(checkout.orderSuccessfullGet);

// Checkout



// Profile

router.route('/profile')
    .get(profile.profileGet);

    // Address
router.route('/address')
    .get(profile.addressGet)

router.route('/api/address/delete')
    .delete(profile.deleteAddess)

router.route('/api/address/update')
    .post(profile.updateAddress)
    // Address

    // Orders
router.route('/orders')
    .get(profile.ordersGet)


    // Orders


// Profile


router.route('*')
    .all(authController.NotFound);

export default router;