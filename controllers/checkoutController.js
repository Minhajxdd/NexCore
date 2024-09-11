// Importing Services
import { addressIdRetreve, addressRetrevefromArray } from '../services/user/profileAddressServices.js'; 




// Importing Models
import cartModel from '../models/cartSchema.js';
import productModel from '../models/productSchema.js';
import addressModel from '../models/addressSchema.js';
import userModel from '../models/userSchema.js';
import orderModel from '../models/orderSchema.js';
import address from '../models/addressSchema.js';


export async function getCheckout(req, res){
    const cartId = req.session.cartId;
    let addresses = [];
    const userId = req.session.userId || req.session.passport.user;


    const addressId = await addressIdRetreve(userId);
    if(addressId.address_id.length !== 0){
        addresses = await addressRetrevefromArray(addressId);
    }

    try{
        const cartData = await cartModel.findById(cartId);
        const productsId = cartData.items.map(item => item.product_id);

        const products = await productModel.find({
            _id: { $in : productsId}
        })
        


        res.render('pages/user/checkout.ejs',{
            products,
            cartData,
            addresses
        });
    }catch(err){
        console.log(`Error which get checkout data on checkout: ${err.message}`);
    }

    
}


export async function orderAuthenticate(req, res){
    const userId = req.session.userId || req.session.passport.user;

    const paymentMethod = req.body.paymentMethod;
    const optionalMessage = req.body.optionalMessage || null;
    let cartData = null;

    let Addressid;
    if(req.body.formData){
        try{

            const address =  {
                first_name: req.body.formData.firstName,
                last_name: req.body.formData.lastName,
                company: req.body.formData.company,
                street: req.body.formData.street,
                land_mark: req.body.formData.land_mark,
                zipcode: req.body.formData.zipcode,
                city_town: req.body.formData.city_town,
                state: req.body.formData.state,
                phone_no: req.body.formData.phone_no,
                email: req.body.formData.email,
                user_id: userId,
              }

            const addressData = await addressModel.create(address);
            Addressid = addressData._id;
            await userModel.findByIdAndUpdate(
            userId,
            {
                $push: {address_id: Addressid}
            }
            )

        }catch(err){
            console.log(`Error while creating new user on checkout: ${err.message}`);
            return res.json({
                status: 'failed',
                message: err.message
            });
        }
    }

    if(req.body.addressId){
        Addressid = req.body.addressId;
    }

    try{

        cartData = await cartModel.findById(
            req.session.cartId
        )
        console.log(cartData);

    }catch(err){
        console.log(`error while fetching data from cart on checkout: ${err.message}`);
    };

    const order = {
        user_id: userId,
        products: cartData.items,
        totalPrice: cartData.totalPrice,
        addressId: Addressid,
        paymentMethod: paymentMethod,
    };

    if(optionalMessage){
        order.note = optionalMessage;
    };

    try{
        const orderData = await orderModel.create(
            order
        )

    }catch(err){
        console.log(`error while creating order : ${err.message}`);
    };

    try{
        await cartModel.findByIdAndUpdate(
            req.session.cartId,
            {
                $set: {
                    items: [],
                    totalPrice: 0
                }
            }
        )

    }catch(err){
        cosnole.og(`error while clearing cart: ${err.message}`);
    }

    res.json({
        status: 'success',
        redirectUrl: '/order/successfull',
        id: address._id
    });
};


export async function orderSuccessfullGet(req, res){
    res.render('pages/user/orderSuccessfull.ejs');
}