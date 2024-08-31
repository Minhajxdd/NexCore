

// Importing Models
import cartModel from '../models/cartSchema.js';
import productModel from '../models/productSchems.js';

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