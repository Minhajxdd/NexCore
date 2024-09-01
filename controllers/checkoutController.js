

// Importing Models
import cartModel from '../models/cartSchema.js';
import productModel from '../models/productSchems.js';
import addressModel from '../models/addressSchema.js';
import userModel from '../models/userSchema.js';

export async function getCheckout(req, res){
    const cartId = req.session.cartId;
    
    try{
        const cartData = await cartModel.findById(cartId);
        const productsId = cartData.items.map(item => item.product_id);

        const products = await productModel.find({
            _id: { $in : productsId}
        })
        


        res.render('pages/user/checkout.ejs',{
            products,
            cartData
        });
    }catch(err){
        console.log(`Error which get checkout data on checkout ${err.message}`);
    }

    
}


export async function orderAuthenticate(req, res){

    const address =  await addressModel.create({
      first_name: req.body.formData.firstName,
      last_name: req.body.formData.lastName,
      company: req.body.formData.company,
      street: req.body.formData.street,
      land_mark: req.body.formData.land_mark,
      optional_message: req.body.formData.optional_message,
      zipcode: req.body.formData.zipcode,
      city_town: req.body.formData.city_town,
      state: req.body.formData.state,
      phone_no: req.body.formData.phone_no,
      email: req.body.formData.email,
      user_id: req.session.userId,
    });

    await userModel.findByIdAndUpdate(
      req.session.userId,
      {
        $push: {address_id: address._id}
      }
    )

    res.json({
        // success: true,
        redirectUrl: '/order/successfull'
    });
}


export async function orderSuccessfullGet(req, res){
    res.render('pages/user/orderSuccessfull.ejs');
}