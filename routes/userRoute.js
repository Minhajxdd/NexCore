import express from 'express';
import noCache,* as authController from '../controllers/authController.js';
import * as users from '../controllers/usserController.js';
import * as carts from '../controllers/cartController.js';
import * as category from '../controllers/categoryController.js';
import * as search from '../controllers/searchController.js';
import * as checkout from '../controllers/checkoutController.js';
import * as profile from '../controllers/profileController.js';
import * as wishlist from '../controllers/wishlistController.js';
import * as product from '../controllers/productController.js';


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

// Product Routes

router.route('/product')
    .get(users.productGet);

router.route('/api/product/review')
    .post(product.reviewApi);

router.route(`/api/product/review/get`)
    .get(product.reviewFilterApi)
    .post(product.getReviewForm)

router.route(`/api/product/review/delete`)
    .post(product.deleteReview)

// Product Routes

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

router.route('/order/create')
    .post(checkout.orderCreate);

router.route('/order/successfull')
    .get(checkout.orderSuccessfullGet);

router.route('/order/payment-failed')
    .get(checkout.paymetFailedGet);

router.route('/api/order/razorpay/create')
    .get(checkout.razorPayCreateOrder)

router.route('/api/order/razorpay/conform')
    .post(checkout.conformPaymentRazorPay)

router.route('/api/coupon/auth')
    .post(checkout.authCoupon)

router.route('/api/checkout/wallet-balance')
    .post(checkout.checkWalletBalance)

// Checkout


// WishList
router.route('/wishlist')
    .get(wishlist.wishListGet)

router.route('/api/wishlist/add')
    .get(wishlist.addtoWishlist)

router.route('/api/wishlist/remove')
    .get(wishlist.wishlistRemove)
// WishList

// Profile

router.route('/profile')
    .get(profile.profileGet);

    // Address
router.route('/address')
    .get(profile.addressGet)

router.route('/api/address/delete')
    .delete(profile.deleteAddess)

router.route('/api/address/create')
    .post(profile.crateAddress)

router.route('/api/address/update')
    .post(profile.updateAddress)
    
    // Address

    // Orders
router.route('/orders')
    .get(profile.ordersGet)

router.route('/orders/overview')
    .get(profile.orderDetailsGet)

router.route('/api/orders/cancel')
    .get(profile.cancelOrderApi)

router.route('/api/orders/return')
    .post(profile.returnRequestOrderApi)

router.route('/api/orders/invoice/data')
    .get(profile.getInvoiceData)

router.route('/api/orders/razor/retry')
    .post(checkout.retryRazorPayCreate);
    
router.route('/api/orders/razor/conform')
    .get(checkout.conformFailedPayment);

    // Orders


    // Wallet
router.route('/wallet')
    .get(profile.getWallet)

    // Wallet

    // Referral
router.route('/referrals')
    .get(profile.getReferral)

    // Referral


// Profile


router.route('*')
    .all(authController.NotFound);

export default router;